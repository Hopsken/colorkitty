import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { Button, Upload, Tooltip } from 'antd'
import arrayMove from 'array-move'
import { RGBColor } from 'react-color'
import * as React from 'react'

import { toHex, toRGBString, readable } from '@/utilities'

interface Props {
  colors: RGBColor[]
  paletteName: string
  currentIndex: number

  updateColors: (colors: RGBColor[]) => void
  onClickColor: (index: number) => void
  onUploadImage: (file: File) => boolean
}

const styles = require('./palette.styl')
const cx = require('classnames/bind').bind(styles)

interface SortableColorItemProps {
  color: RGBColor
  length: number
  isActive: boolean
  handleClickColor: () => void
}

interface SortableColorListProps {
  colors: RGBColor[]
  currentIndex: number
  handleClick: (index: number) => () => void
}

const SortableColorItem = SortableElement(({
  color,
  length,
  isActive,
  handleClickColor
}: SortableColorItemProps) => (
    <div
      className={ cx('c', `c-${length}`, { active: isActive }) }
      style={ { backgroundColor: toRGBString(color) } }
      onClick={ handleClickColor }
    >
      <span style={ { color: readable(color) } }>{ toHex(color).toUpperCase() }</span>
    </div>
  )
)

const SortableColorList = SortableContainer(({
  colors,
  handleClick,
  currentIndex,
}: SortableColorListProps) => {
  const items = colors.map((color: any, index: number, all: any) => (
    <SortableColorItem
      key={ `color-${index}` }
      index={ index }
      color={ color }
      isActive={ currentIndex === index }
      length={ all.length }
      handleClickColor={ handleClick(index) }
    />)
  )

  return (
    <div className={ styles['palette-colors'] } >
      { items }
    </div>)
})

export class Palette extends React.PureComponent<Props> {

  renderColor = (
    color: RGBColor,
    index: number,
    colors: RGBColor[]
  ) => (
    <div
      key={ index }
      className={ cx('c', `c-${colors.length}`) }
      style={ { backgroundColor: toRGBString(color) } }
      onClick={ this.handleClickColor(index) }
    >
      <span>{ toHex(color).toUpperCase() }</span>
    </div>
  )

  renderPalette = () => (
    <SortableColorList
      axis='x'
      lockAxis='x'
      currentIndex={ this.props.currentIndex }
      colors={ this.props.colors }
      handleClick={ this.handleClickColor }
      onSortEnd={ this.handleDragColorEnd }
      distance={ 10 }
      lockToContainerEdges={ true }
    />
  )

  renderBottom = () => (
    <div className={ styles['palette-info'] }>
      <span className={ styles['palette-name'] }>{ this.props.paletteName || 'NEW PALETEE' }</span>

      <div className={ styles['palette-control'] }>
        <Upload
          accept={ 'image/*' }
          beforeUpload={ this.props.onUploadImage  }
          showUploadList={ false }
        >
          <Tooltip title='Pick colors from Image'>
            <Button icon='camera' />
          </Tooltip>
        </Upload>
      </div>
    </div>
  )

  render() {
    return (
      <section className={ styles['palette'] }>
        { this.renderPalette() }
        { this.renderBottom() }
      </section>
    )
  }

  handleClickColor = (index: number) => () => {
    this.props.onClickColor(index)
  }

  handleDragColorEnd = ({ oldIndex, newIndex }: {
    oldIndex: number,
    newIndex: number
  }) => {
    this.props.updateColors(
      arrayMove(this.props.colors, oldIndex, newIndex)
    )
  }
}
