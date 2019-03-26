import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import { RGBColor, ColorResult } from 'react-color'
import * as React from 'react'
import {
  Button, Slider,
  Popover, Upload,
  message, Drawer,
  Icon, Tooltip ,
} from 'antd'

import { toHex, toRGBString, exportPNG } from '@/utilities'
import { SuprePicker, Painter } from '@/views/components'

const styles = require('./composer.styl')
const cx = require('classnames/bind').bind(styles)
const displayError = (content: string) => message.error(content)

interface State {
  colors: RGBColor[]
  colorNumbers: number
  currentIndex: number
  paletteName: string
  showDrawer: boolean
  rawImage: File | null
}

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

export class ComposerContainer extends React.PureComponent<any, State> {

  private drawerContainer = React.createRef<HTMLElement>()

  state = {
    colors: [
      { r: 231, g: 218, b: 253 },
      { r: 105, g: 87, b: 200 },
      { r: 80, g: 64, b: 166 },
      { r: 67, g: 50, b: 160 },
      { r: 41, g: 26, b: 124 },
      { r: 20, g: 6, b: 100 }
    ],
    colorNumbers: 5,
    currentIndex: -1,
    paletteName: '',
    showDrawer: false,
    rawImage: null
  }

  componentDidCatch() {
    displayError('Some unexpected error happen, please try again.')
  }

  getDrawerContainer = () => {
    return this.drawerContainer.current!
  }

  renderSideDrawer = () => {
    const { showDrawer, colors } = this.state

    return (
      <Drawer
        mask={ false }
        visible={ showDrawer }
        getContainer={ this.getDrawerContainer }
        title='Color Picker'
        onClose={ this.handleCloseDrawer }
        width={ 300 }
      >
        <SuprePicker
          color={ colors[this.state.currentIndex] }
          onChange={ this.handleChangeColor }
        />
      </Drawer>
    )
  }

  renderColor = (
    color: RGBColor,
    index: number,
    colors: RGBColor[]
  ) => {
    return (
      <div
        key={ index }
        className={ cx('c', `c-${colors.length}`) }
        style={ { backgroundColor: toRGBString(color) } }
        onClick={ this.handleClickColor(index) }
      >
        <span>{ toHex(color).toUpperCase() }</span>
      </div>
    )
  }

  renderPalette = () => (
    <SortableColorList
      axis='x'
      lockAxis='x'
      colors={ this.colors }
      handleClick={ this.handleClickColor }
      onSortEnd={ this.handleDragColorEnd }
      distance={ 10 }
      lockToContainerEdges={ true }
    />
  )

  renderPaletteToolbox = () => {
    const twitterShareUrl = 'https://twitter.com/intent/tweet?'
    + 'orginal_referer=https://colorkitty.com&button_hashtag=colorkitty'
    + '&url=https://colorkitty.com&text=Extract perfect palettes from delicious pictures.'

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

  renderCard = () => {
    const { paletteName, colorNumbers } = this.state

    const nameInput = (
      <input
        className={ styles['palette-name'] }
        value={ paletteName }
        onChange={ this.handleInputName }
        placeholder='NEW PALETTE'
      />
    )

    const controls = (
      <div className={ styles['palette-settings'] }>

        <span className={ styles['palette-slider-title'] }>COUNT</span>
        <div className={ styles['palette-slider'] }>
          <span className={ styles['palette-slider-tip'] }>1</span>
          <Slider
            value={ colorNumbers }
            step={ 1 }
            max={ 6 }
            min={ 1 }
            onChange={ this.handleChangeNumbers }
          />
          <span className={ styles['palette-slider-tip'] }>6</span>
        </div>
      </div>
    )

    return (
      <section className={ styles['palette'] }>

        { this.renderPalette() }

        <div className={ styles['palette-info'] }>
          { nameInput }

          <div className={ styles['palette-control'] }>
            <Popover placement='bottom' content={ controls } trigger={ 'click' }>
              <Tooltip title='Settings'>
                <Button icon='sliders' />
              </Tooltip>
            </Popover>
            <Upload
              accept={ 'image/*' }
              beforeUpload={ this.handleUploadImage  }
              showUploadList={ false }
            >
              <Tooltip title='Pick colors from Image'>
                <Button icon='camera' />
              </Tooltip>
            </Upload>
          </div>
        </div>

        { this.renderPaletteToolbox() }

      </section>
    )
  }

  render() {

    return (
      <section className={ styles['container'] } ref={ this.drawerContainer }>
        { this.renderCard() }
        { this.renderSideDrawer() }
        <Painter
          colors={ this.colors }
          file={ this.state.rawImage }
          updateColors={ this.handleUpdateColors }
          updateCurrentIndex={ this.handleUpdateCurrentIndex }
        />
      </section>
    )
  }

  handleUpdateColors = (colors: RGBColor[]) => {
    this.setState({
      colors
    })
  }

  handleDragColorEnd = ({ oldIndex, newIndex }: {
    oldIndex: number,
    newIndex: number
  }) => {
    this.setState({
      colors: arrayMove(this.state.colors, oldIndex, newIndex)
    })
  }

  handleChangeNumbers = (count: number) => {
    this.setState({
      colorNumbers: count
    })
  }

  handleChangeColor = (color: ColorResult) => {
    const { colors, currentIndex } = this.state
    this.handleUpdateColors(
      colors.map((value, index) => {
        if (index === currentIndex ) {
          return color.rgb
        } else {
          return value
        }
      })
    )
  }

  handleCloseDrawer = () => {
    this.setState({
      showDrawer: false
    })
  }

  handleClickColor = (index: number) => () => {
    this.setState({
      currentIndex: index,
      showDrawer: true
    })
  }

  handleInputName = (ev: React.FormEvent<HTMLInputElement>) => {
    const target = ev.target as HTMLInputElement
    this.setState({
      paletteName: target.value
    })
  }

  handleUploadImage = (file: File) => {
    this.setState({
      rawImage: file
    })
    return false
  }

  handleExport = () => {
    exportPNG(
      this.colors.map(one => toHex(one)),
      this.state.paletteName || 'New Palette'
    )
  }

  handleUpdateCurrentIndex = (index: number) => {
    this.setState({
      currentIndex: index
    })
  }

  private get colors() {
    return this.state.colors.slice(0, this.state.colorNumbers)
  }
}
