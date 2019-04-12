import { RGBColor, ColorResult } from 'react-color'
import { message, Layout, Alert, Icon } from 'antd'
import * as React from 'react'

import { SuprePicker, Painter, Palette, Footer, LeftPad } from '@/views/components'
import { parseColorsFromUrl } from '@/utilities'

const styles = require('./composer.styl')
const displayError = (content: string) => message.error(content)

interface State {
  colors: RGBColor[]
  colorsCount: number
  currentIndex: number
  paletteName: string
  showDrawer: boolean
  rawImage: File | string | null
}

const defaultPalette = [
  { r: 23, g: 63, b: 95 },
  { r: 32, g: 99, b: 155 },
  { r: 60, g: 174, b: 163 },
  { r: 246, g: 213, b: 92 },
  { r: 237, g: 85, b: 59 },
  { r: 23, g: 154, b: 209 }
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
    const rightSide = showDrawer && (<SuprePicker
      color={ colors[currentIndex] }
      onChange={ this.handleChangeColor }
      colors={ this.colors }
    />)

    return (
      <section className={ styles['container'] }>
        <Alert
          type='info'
          icon={ <Icon type='desktop' /> }
          className={ styles['notice-bar'] }
          message='We are better on desktop.'
          banner={ true }
          closable={ true }
        />
        <Layout>
          <Layout.Sider breakpoint='lg' collapsedWidth='0' width={ 280 } className={ styles['sidebar'] }>
            <div className={ styles['sidebar-wrapper'] }>
              <LeftPad
                colors={ this.colors }
                paletteName={ this.state.paletteName }
                onChangeColorsCount={ this.handleChangeNumbers }
                onInputPaletteName={ this.handleInputName }
              />
            </div>
          </Layout.Sider>

          <Layout.Content className={ styles['content'] }>
            <section className={ styles['core'] }>
              <Palette
                colors={ this.colors }
                paletteName={ paletteName }
                updateColors={ this.handleUpdateColors }
                onChangeColorsCount={ this.handleChangeNumbers }
                onChangePaletteName={ this.handleInputName }
                onClickColor={ this.handleClickColor }
                onUploadImage={ this.handleUploadImage }
                currentIndex={ currentIndex }
              />

              <Painter
                colors={ this.colors }
                file={ rawImage }
                updateColors={ this.handleUpdateColors }
                updateCurrentIndex={ this.handleUpdateCurrentIndex }
              />
            </section>
            <Footer />
          </Layout.Content>

          <Layout.Sider reverseArrow={ true } breakpoint='lg' collapsedWidth='0' width={ 280 } className={ styles['sidebar'] }>
          <div className={ styles['sidebar-wrapper'] }>
            { rightSide }
          </div>
        </Layout.Sider>
      </Layout>
      </section>
    )
  }

  handleUpdateColors = (colors: RGBColor[]) => {
    this.setState({
      colors: colors.concat(this.state.colors.slice(colors.length))
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
    const { currentIndex } = this.state
    this.setState({
      currentIndex: index === currentIndex ? -1 : index,
      showDrawer: index === currentIndex ? false : true
    })
  }

  handleInputName = (ev: React.FormEvent<HTMLInputElement>) => {
    const target = ev.target as HTMLInputElement
    this.setState({
      paletteName: target.value
    })
  }

  handleUploadImage = (file: File | string) => {
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
