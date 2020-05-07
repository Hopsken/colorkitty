import Draggable, { DraggableData } from 'react-draggable'
import { Color, RGBColor } from 'react-color'
import { Icon, Spin, message } from 'antd'
import * as React from 'react'

import {
  toRGBString,
  getImageDataUrlAsync,
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
const loadingIcon = <Icon type='loading' style={{ fontSize: 48 }} spin={true} />

export class Painter extends React.PureComponent<Props, State> {

  state = {
    hidden: true
  }

  private canvas = React.createRef<HTMLCanvasElement>()
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
    // 小屏幕上不显示
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    if (viewportWidth < 768) {
      return null
    }

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
          key={position}
          bounds={bounds}
          defaultPosition={{ x: offsetX, y: offsetY }}
          onStart={this.handleDragStart(index)}
          onDrag={this.handleDragPickle(index)}
          onStop={this.handleDragPickle(index)}
        >
          <Pickle
            size={40}
            color={toRGBString(colors[index])}
            style={pickleStyle}
            index={index + 1}
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
        className={styles.painter}
        style={{ visibility: file ? 'visible' : 'hidden' }}
      >
        {hidden && <Spin indicator={loadingIcon} />}
        <div
          className={styles.painting}
          style={{ display: hidden ? 'none' : 'block' }}
        >
          <canvas
            ref={this.canvas}
            {...this.canvasSize}
          />
          {this.renderPickers()}
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

  handleLoadImage = async (file: File | string | null) => {
    if (!this.canvas.current || !file) {
      return null
    }

    // 多次上传时，隐藏之前图片，显示 loading
    this.setState({
      hidden: true
    })

    const ctx = this.canvas.current.getContext('2d')
    const imageUrl = typeof file === 'string' ? file : await getImageDataUrlAsync(file)

    // 绘制图片至 canvas
    const img = new Image()
    img.crossOrigin = ''
    img.onload = () => {
      this.setCanvasSize(img.height, img.width)
      this.setState({
        hidden: false
      }, () => {
        ctx!.drawImage(img, 0, 0, this.canvasSize.width, this.canvasSize.height)

        const imageData = ctx!.getImageData(0, 0, this.canvasSize.width, this.canvasSize.height)
        this.loadColorsFromImageData(imageData)
      })
    }
    img.src = imageUrl
    img.onerror = () => message.error('Error on loading image. Please try another one.')

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
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    const canvasWidth = viewportWidth < 768 ? 300 : 560

    return this.canvasSize = {
      width: canvasWidth,
      height: Math.floor(canvasWidth * (rawHeight / rawWidth))
    }
  }
}
