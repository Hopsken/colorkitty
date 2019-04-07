import { message, Drawer } from 'antd'
import { RGBColor, ColorResult } from 'react-color'
import * as React from 'react'

import { SuprePicker, Painter, Palette } from '@/views/components'
import { parseColorsFromUrl } from '@/utilities'

const styles = require('./composer.styl')
const displayError = (content: string) => message.error(content)

interface State {
  colors: RGBColor[]
  colorsCount: number
  currentIndex: number
  paletteName: string
  showDrawer: boolean
  rawImage: File | null
}

const defaultPalette = [
  { r: 231, g: 218, b: 253 },
  { r: 105, g: 87, b: 200 },
  { r: 80, g: 64, b: 166 },
  { r: 67, g: 50, b: 160 },
  { r: 41, g: 26, b: 124 },
  { r: 20, g: 6, b: 100 }
]

export class ComposerContainer extends React.PureComponent<any, State> {

  private drawerContainer = React.createRef<HTMLElement>()

  state = {
    colors: defaultPalette,
    colorsCount: 5,
    currentIndex: -1,
    paletteName: '',
    showDrawer: false,
    rawImage: null
  }

  componentDidMount() {
    const palette = parseColorsFromUrl()
    if (palette) {
      this.setState({
        colors: palette
      })
    }
  }

  componentDidCatch() {
    displayError('Some unexpected error happen, please try again.')
  }

  getDrawerContainer = () => {
    return this.drawerContainer.current!
  }

  render() {
    const { paletteName, colors, currentIndex, rawImage, showDrawer } = this.state

    return (
      <section className={ styles['container'] } ref={ this.drawerContainer }>
        <Palette
          colors={ this.colors }
          paletteName={ paletteName }
          updateColors={ this.handleUpdateColors }
          onChangeColorsCount={ this.handleChangeNumbers }
          onChangePaletteName={ this.handleInputName }
          onClickColor={ this.handleClickColor }
          onUploadImage={ this.handleUploadImage }
        />

        <Painter
          colors={ this.colors }
          file={ rawImage }
          updateColors={ this.handleUpdateColors }
          updateCurrentIndex={ this.handleUpdateCurrentIndex }
        />

        <Drawer
          mask={ false }
          visible={ showDrawer }
          getContainer={ this.getDrawerContainer }
          title='Color Picker'
          onClose={ this.handleCloseDrawer }
          width={ 300 }
        >
          <SuprePicker
            color={ colors[currentIndex] }
            onChange={ this.handleChangeColor }
          />
        </Drawer>
      </section>
    )
  }

  handleUpdateColors = (colors: RGBColor[]) => {
    this.setState({
      colors
    })
  }

  handleChangeNumbers = (count: number) => {
    this.setState({
      colorsCount: count
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

  handleClickColor = (index: number) => {
    this.setState({
      currentIndex: index,
      showDrawer: true
    })
  }

  handleInputName = (paletteName: string) => {
    this.setState({
      paletteName
    })
  }

  handleUploadImage = (file: File) => {
    this.setState({
      rawImage: file
    })
    return false
  }

  handleUpdateCurrentIndex = (index: number) => {
    this.setState({
      currentIndex: index
    })
  }

  private get colors() {
    return this.state.colors.slice(0, this.state.colorsCount)
  }
}
