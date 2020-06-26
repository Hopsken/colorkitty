import { RGBColor, ColorResult } from 'react-color'
import { message, Layout, Alert, Icon } from 'antd'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { Painter, SmartPalette, LeftPad } from '@/views/components'
import { parseColorsFromUrl } from '@/utilities'
import { SavePalettePayload, savePalette } from '@/services'
import { Palette } from '@/types'

const styles = require('./composer.styl')
const displayError = (content: string) => message.error(content)

interface Props extends RouteComponentProps {
  user: any
  onSavePaletteSuccess: (palette: Palette) => void
}

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
  { r: 23, g: 154, b: 209 },
]

export class ComposerContainer extends React.PureComponent<Props, State> {
  private drawerContainer = React.createRef<HTMLElement>()

  state = {
    colors: defaultPalette,
    colorsCount: 5,
    currentIndex: -1,
    paletteName: 'NEW PALETTE',
    showDrawer: false,
    rawImage: null,
  }

  componentDidMount() {
    this.loadUrlColors()
  }

  componentDidCatch() {
    displayError('Some unexpected error happen, please try again.')
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.loadUrlColors()
    }
  }

  getDrawerContainer = () => {
    return this.drawerContainer.current!
  }

  render() {
    const {
      paletteName,
      // colors,
      currentIndex,
      rawImage,
      showDrawer,
    } = this.state
    const rightSide = showDrawer ? (
      // <SuprePicker
      //   color={colors[currentIndex]}
      //   onChange={this.handleChangeColor}
      //   colors={this.colors}
      // />
      null
    ) : (
      <div className={styles['sidebar-tips']}>
        Click one color to view details
      </div>
    )

    return (
      <section className={styles.container}>
        <Alert
          type="info"
          icon={<Icon type="desktop" />}
          className={styles['notice-bar']}
          message="We are better on desktop."
          banner={true}
          closable={true}
        />
        <Layout>
          <Layout.Sider
            breakpoint="lg"
            collapsedWidth="0"
            width={280}
            className={styles.sidebar}
          >
            <LeftPad
              paletteName={paletteName}
              colors={this.colors}
              onChangePaletteName={this.handleInputName}
              onChangeColorsCount={this.handleChangeNumbers}
            />
          </Layout.Sider>

          <Layout.Content className={styles.content}>
            <section className={styles.core}>
              <SmartPalette
                colors={this.colors}
                paletteName={paletteName}
                updateColors={this.handleUpdateColors}
                onChangeColorsCount={this.handleChangeNumbers}
                onClickColor={this.handleClickColor}
                onUploadImage={this.handleUploadImage}
                onSavePalette={this.handleSavePalette}
                currentIndex={currentIndex}
              />

              <Painter
                colors={this.colors}
                file={rawImage}
                updateColors={this.handleUpdateColors}
                updateCurrentIndex={this.handleClickColor}
              />
            </section>
          </Layout.Content>

          <Layout.Sider
            reverseArrow={true}
            breakpoint="lg"
            collapsedWidth="0"
            width={280}
            className={styles.sidebar}
          >
            <div className={styles['sidebar-wrapper']}>{rightSide}</div>
          </Layout.Sider>
        </Layout>
      </section>
    )
  }

  handleUpdateColors = (colors: RGBColor[]) => {
    this.setState({
      colors: colors.concat(this.state.colors.slice(colors.length)),
    })
  }

  handleChangeNumbers = (count: number) => {
    this.setState({
      colorsCount: count,
    })
  }

  handleChangeColor = (color: ColorResult) => {
    const { colors, currentIndex } = this.state
    this.handleUpdateColors(
      colors.map((value, index) => {
        if (index === currentIndex) {
          return color.rgb
        } else {
          return value
        }
      }),
    )
  }

  handleCloseDrawer = () => {
    this.setState({
      showDrawer: false,
    })
  }

  handleClickColor = (index: number) => {
    const { currentIndex } = this.state
    this.setState({
      currentIndex: index === currentIndex ? -1 : index,
      showDrawer: index === currentIndex ? false : true,
    })
  }

  handleInputName = (name: string) => {
    this.setState({
      paletteName: name,
    })
  }

  handleUploadImage = (file: File | string) => {
    this.setState({
      rawImage: file,
    })
    return false
  }

  handleUpdateCurrentIndex = (index: number) => {
    this.setState({
      currentIndex: index,
    })
  }

  handleSavePalette = (payload: SavePalettePayload) => {
    const { user, onSavePaletteSuccess } = this.props
    if (!user) {
      message.warn('Please login first.')
      return Promise.reject()
    }
    return savePalette(payload)
      .then(palette => {
        onSavePaletteSuccess(palette)
        this.props.history.push(`/u/${user.username}`)
      })
      .catch(() => {
        message.warn('Fail to save palette.')
      })
  }

  private loadUrlColors() {
    const urlParams = new URLSearchParams(window.location.search)
    const name = urlParams.get('name')
    const colors = urlParams.get('colors')
    if (!colors) {
      return
    }
    const palette = parseColorsFromUrl(colors)
    if (palette) {
      this.setState({
        colors: palette.concat(this.state.colors.slice(palette.length)),
        colorsCount: palette.length,
        paletteName: name || 'New Palette',
      })
    }
  }

  private get colors() {
    return this.state.colors.slice(0, this.state.colorsCount)
  }
}
