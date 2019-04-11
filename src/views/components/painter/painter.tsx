import Draggable, { DraggableData } from 'react-draggable'
import { Color, RGBColor } from 'react-color'
import { Icon, Spin } from 'antd'
import * as React from 'react'

import {
  toRGBString,
  getImageBase64,
  getColorsFromImage,
  getPaletteFromImage,
  findNearestColorOfPalette,
} from '@/utilities'
import { Pickle } from '@/views/components'

interface Props {
  colors: RGBColor[]
  file: File | null
  imageUrl?: string

  updateColors: (colors: Color[]) => void
  updateCurrentIndex: (index: number) => void
}

interface State {
  hidden: boolean
}

const styles = require('./painter.styl')
const pickleStyle = {
  top: -55,
  left: -20
}
const loadingIcon = <Icon type='loading' style={ { fontSize: 48 } } spin={ true } />

export class Painter extends React.PureComponent<Props, State> {

  state = {
    hidden: true
  }

  private canvas = React.createRef<HTMLCanvasElement>()
  private baseFontSize = parseInt(
    window.getComputedStyle(document.body)
      .getPropertyValue('font-size')
      .substring(0, 2)
  ) || 16
  private imageColors: RGBColor[] = []
  private colorsPosition: number[] = []
  private canvasSize = {
    height: 0,
    width: 0
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.file !== this.props.file) {
      this.handleLoadImage(this.props.file)
    }
  }

  renderPickers() {
    const { colors } = this.props
    const bounds = {
      left: 0,
      top: 0,
      right: this.canvasSize.width,
      bottom: this.canvasSize.height
    }

    return this.colorsPosition.slice(0, colors.length).map(
      (position, index) => {
      const { offsetX, offsetY } = this.getPickleOffset(position)
      return (
        <Draggable
          key={ position }
          bounds={ bounds }
          defaultPosition={ { x: offsetX, y: offsetY } }
          onStart={ this.handleDragStart(index) }
          onDrag={ this.handleDragPickle(index) }
          onStop={ this.handleDragPickle(index) }
        >
          <Pickle
            size={ 40 }
            color={ toRGBString(colors[index]) }
            style={ pickleStyle }
            index={ index + 1 }
          />
        </Draggable>
      )
    })
  }

  render() {
    const { hidden } = this.state
    const { file } = this.props

    return (
      <section
        className={ styles['painter'] }
        style={ { visibility: file ? 'visible' : 'hidden' } }
      >
        { hidden && <Spin indicator={ loadingIcon } /> }
        <div
          className={ styles['painting'] }
          style={ { display: hidden ? 'none' : 'block' } }
        >
          <canvas
            ref={ this.canvas }
            { ...this.canvasSize }
          />
          { this.renderPickers() }
        </div>
      </section>
    )
  }

  handleDragStart = (index: number) => () => {
    this.props.updateCurrentIndex(index)
  }

  handleDragPickle = (index: number) => (_: MouseEvent, data: DraggableData) => {
    const { updateColors, colors } = this.props
    const picklePositin = Math.round(data.y) * this.canvasSize.width + Math.round(data.x)

    if (picklePositin < 0 || picklePositin >= this.imageColors.length) {
      return
    }

    updateColors(
      colors.map(
        (color, idx) => idx === index
          ? this.imageColors[picklePositin]
          : color
      )
    )
  }

  handleLoadImage = (file: File | null) => {
    if (!this.canvas.current || !file) {
      return null
    }

    this.setState({
      hidden: true
    })

    const ctx = this.canvas.current.getContext('2d')
    getImageBase64(file!, (imageUrl: string) => {
      const img = new Image()
      img.onload = () => {
        this.setCanvasSize(img.height, img.width)
        this.forceUpdate()
        this.setState({
          hidden: false
        }, () => {
          ctx!.drawImage(img, 0, 0, this.canvasSize.width, this.canvasSize.height)

          const imageData = ctx!.getImageData(0, 0, this.canvasSize.width, this.canvasSize.height)
          this.loadColorsFromImageData(imageData)
        })
      }

      img.src = imageUrl!
    })

    return false
  }

  private loadColorsFromImageData(imageData: ImageData) {
    this.imageColors = getColorsFromImage(imageData)

    const palette = getPaletteFromImage(imageData, 6)
    if (!palette) {
      throw Error('Error on processing image.')
    }

    const nearsetColors = findNearestColorOfPalette(
      this.imageColors, palette
    )
    this.colorsPosition = nearsetColors.map(one => one.index)
    this.props.updateColors(
      nearsetColors.map(one => one.rgb)
    )
  }

  private getPickleOffset(index: number) {
    const { width } = this.canvasSize

    return {
      offsetX: Math.floor(index % width),
      offsetY: Math.ceil(index / width)
    }
  }

  private setCanvasSize(rawHeight: number, rawWidth: number) {
    return this.canvasSize = {
      width: this.baseFontSize * 40,
      height: Math.floor(this.baseFontSize * 40 * (rawHeight / rawWidth))
    }
  }
}
