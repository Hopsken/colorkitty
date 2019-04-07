import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import { RGBColor } from 'react-color'
import * as React from 'react'
import {
  Button, Slider,
  Popover, Upload, Tooltip
} from 'antd'

import { toHex, toRGBString } from '@/utilities'
import { PaletteToolbox } from './palette-toolbox'

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
        <PaletteToolbox
          colors={ this.props.colors }
          paletteName={ this.props.paletteName }
        />
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

  handleInputName = (ev: React.FormEvent<HTMLInputElement>) => {
    const target = ev.target as HTMLInputElement
    this.props.onChangePaletteName(target.value)
  }
}
