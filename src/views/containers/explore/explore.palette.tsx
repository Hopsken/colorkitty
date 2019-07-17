import * as React from 'react'
import { Color } from 'react-color'
import { Tooltip, Icon, Button } from 'antd'

import { toHex, toRGBString } from '@/utilities'

const styles = require('./explore.palette.styl')
const cx = require('classnames/bind').bind(styles)

interface State {
    tooltip: string
}

interface Props {
    colors: Color[]
    name?: string
    likes?: number
    time?: string
    liked?: boolean
    className?: string
    onClickColor?: (index: number) => void
    onLike?: () => void
}

export class PaletteComponent extends React.PureComponent<Props, State> {

    state = {
        tooltip: 'Click To Copy'
    }

    renderColor = (color: string, index: number) => {
        const { tooltip } = this.state

        return (
            <div
                key={index}
                className={styles['c']}
                style={{ backgroundColor: toRGBString(color) }}
                onClick={this.handleClickColor(index)}
            >
                <Tooltip
                    title={tooltip}
                    onVisibleChange={this.handleTooltipChange}
                >
                    <span onClick={this.handleClick.bind(this, color)}>{toHex(color).toUpperCase()}</span>
                </Tooltip>
            </div>
        )
    }

    renderBottom = () => {
        const { time, name, likes = 0, liked = false } = this.props

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
                    {time && <span className={styles['bottom-date']}>{time}</span>}
                </div>
                {Stars}
            </div>
        )
    }

    render() {
        const { colors, className } = this.props

        if (!colors || colors.length === 0) {
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

        // @ts-ignorets-ignore
        if (!navigator.clipboard) {
            return
        }

        // @ts-ignorets-ignore
        navigator.clipboard.writeText(value)

        this.setState({
            tooltip: 'Copied 🎉'
        })
    }

    handleClickLike = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if (this.props.onLike) {
            this.props.onLike()
        }
    }

    handleTooltipChange = () => {
        this.setState({
            tooltip: 'Click To Copy'
        })
    }

    handleClickColor = (index: number) => () => {
        const { onClickColor } = this.props

        if (typeof onClickColor === 'function') {
            onClickColor(index)
        }
    }
}
