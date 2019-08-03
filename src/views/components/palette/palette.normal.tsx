import * as React from 'react'
import { Icon, Button, message } from 'antd'
import copy from 'copy-to-clipboard'

import { toHex, toRGBString } from '@/utilities'
import { Palette } from '@/types'

const styles = require('./palette.normal.styl')
const cx = require('classnames/bind').bind(styles)

interface Props {
  palette: Palette
  className?: string
  onClickColor?: (index: number) => void
  onLike?: () => void
}

export class PaletteComponent extends React.PureComponent<Props> {
  renderColor = (color: string, index: number) => {
    return (
      <div
        key={index}
        className={styles['c']}
        style={{ backgroundColor: toRGBString(color) }}
        onClick={this.handleClickColor(index)}
      >

        <span onClick={this.handleClick.bind(this, color)}>{toHex(color).toUpperCase()}</span>
      </div>
    )
  }

  renderBottom = () => {
    const { created, name, likes = 0, liked = false } = this.props.palette
    console.info(this.props.palette)

    const Stars = likes != null && (
      <Button
        className={styles['bottom-fav']}
        onClick={this.handleClickLike}
      >
        <Icon
          type='heart'
          theme='filled'
          className={cx({ 'active': liked })}
        />
        {likes != 0 && <span>{likes}</span>}
      </Button>
    )

    return (
      <div className={styles['bottom']}>
        <div className={styles['bottom-info']}>
          {name && <span className={styles['bottom-name']}>{name}</span>}
          {created && <span className={styles['bottom-date']}>{created}</span>}
        </div>
        {Stars}
      </div>
    )
  }

  render() {
    const { className, palette } = this.props
    const { colors } = palette

    if (!palette || !colors || colors.length === 0) {
      return null
    }

    const colorCards = colors.map((color, index) => {
      return this.renderColor(toHex(color), index)
    })

    return (
      <div className={cx({ palette: true, [className!]: !!className })}>
        <div className={styles['colors']}>
          {colorCards}
        </div>
        {this.props.children ? this.props.children : this.renderBottom()}
      </div>
    )
  }

  handleClick = (value: string) => {
    if (copy(value)) {
      message.success('Successfully copied!')
    }
  }

  handleClickLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (this.props.onLike) {
      this.props.onLike()
    }
  }

  handleClickColor = (index: number) => () => {
    const { onClickColor } = this.props

    if (typeof onClickColor === 'function') {
      onClickColor(index)
    }
  }
}
