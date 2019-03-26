import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import * as React from 'react'
import { RGBColor } from 'react-color'
import {
  Button, Slider,
  Popover, Upload,
  Icon, Tooltip ,
} from 'antd'

import { toHex, toRGBString, exportPNG } from '@/utilities'

interface Props {
  colors: RGBColor[]
  paletteName: string

  updateColors: (colors: RGBColor[]) => void
  onChangeColorsCount: (count: number) => void
  onChangePaletteName: (name: string) => void
  onClickColor: (index: number) => void
  onUploadImage: (file: File) => boolean
}

const styles = require('./palette.styl')
const cx = require('classnames/bind').bind(styles)

const twitterShareUrl = 'https://twitter.com/intent/tweet?'
    + 'orginal_referer=https://colorkitty.com&button_hashtag=colorkitty'
    + '&url=https://colorkitty.com&text=Extract perfect palettes from delicious pictures.'

const SortableColorItem = SortableElement<{
  color: RGBColor,
  length: number,
  handleClickColor: () => void
}>(({
  color,
  length,
  handleClickColor
}) => (
    <div
      className={ cx('c', `c-${length}`) }
      style={ { backgroundColor: toRGBString(color) } }
      onClick={ handleClickColor }
    >
      <span>{ toHex(color).toUpperCase() }</span>
    </div>
  )
)

const SortableColorList = SortableContainer<{
  colors: RGBColor[],
  handleClick: (index: number) => () => void
}>(({
  colors,
  handleClick,
}) => {
  const items = colors.map((color: any, index: any, all: any) => (
    <SortableColorItem
      key={ `color-${index}` }
      index={ index }
      color={ color }
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
      colors={ this.props.colors }
      handleClick={ this.handleClickColor }
      onSortEnd={ this.handleDragColorEnd }
      distance={ 10 }
      lockToContainerEdges={ true }
    />
  )

  renderPaletteToolbox = () => {
    return (
      <div className={ styles['palette-toolbox'] }>
        <Button
          onClick={ this.handleExport }
        >
          <Icon type='picture' />Export
        </Button>
        <Button href={ twitterShareUrl }>
          <Icon type='twitter' />Tweet
        </Button>
      </div>
    )
  }

  renderControls = () => {
    const { colors, onChangeColorsCount } = this.props

    return (
      <div className={ styles['palette-settings'] }>
        <span className={ styles['palette-slider-title'] }>COUNT</span>
        <div className={ styles['palette-slider'] }>
          <span className={ styles['palette-slider-tip'] }>1</span>
          <Slider
            value={ colors.length }
            step={ 1 }
            max={ 6 }
            min={ 1 }
            onChange={ onChangeColorsCount }
          />
          <span className={ styles['palette-slider-tip'] }>6</span>
        </div>
      </div>
    )
  }

  renderBottom = () => (
    <div className={ styles['palette-info'] }>
      <input
        className={ styles['palette-name'] }
        value={ this.props.paletteName }
        onChange={ this.handleInputName }
        placeholder='NEW PALETTE'
      />

      <div className={ styles['palette-control'] }>
        <Popover placement='bottom' content={ this.renderControls() } trigger={ 'click' }>
          <Tooltip title='Settings'>
            <Button icon='sliders' />
          </Tooltip>
        </Popover>
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
        { this.renderPaletteToolbox() }
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
    this.props.onClickColor(newIndex)
  }

  handleExport = () => {
    exportPNG(
      this.props.colors.map(one => toHex(one)),
      this.props.paletteName || 'New Palette'
    )
  }

  handleInputName = (ev: React.FormEvent<HTMLInputElement>) => {
    const target = ev.target as HTMLInputElement
    this.props.onChangePaletteName(target.value)
  }
}
