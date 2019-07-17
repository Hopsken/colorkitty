import { RGBColor } from 'react-color'
import * as React from 'react'
import {
  Card, Form, Input, Slider,
  Button, Checkbox, Icon,
  Modal, message
} from 'antd'

import { ExportMethod, exportMethods } from '@/utilities'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'

const styles = require('./left-pad.styl')
const twitterShareUrl = 'https://twitter.com/intent/tweet?'
  + 'button_hashtag=colorkitty'
  + '&url=__URL__&text=Palette: __PALETTE_NAME__.'
const exportMethodsArray = [
  {
    name: ExportMethod.URL,
    icon: 'link'
  }, {
    name: ExportMethod.PNG,
    icon: 'picture'
  }, {
    name: ExportMethod.SCSS,
    icon: 'code'
  }, {
    name: ExportMethod.JSON,
    icon: 'copy'
  }, {
    name: ExportMethod.HEX,
    icon: 'file-text'
  }
]
// const PHLink = (
//   <a
//     href='https://www.producthunt.com/posts/colorkitty?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-colorkitty'
//     target='_blank'
//   >
//     <img
//       src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=151664&theme=light'
//       alt='ColorKitty - Find perfect palettes from great pictures. | Product Hunt Embed'
//       style={ { width: 250, height: 54 } }
//       width='250px'
//       height='54px'
//     />
//   </a>
// )

const buyMeCoffee = (
  <a
    className={styles['bmc-button']}
    target='_blank'
    href='https://www.buymeacoffee.com/hopsken'
  >
    <img
      src='https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg'
      alt='Buy me a coffee'
    />
    <span>Buy me a coffee</span>
  </a>
)

interface LeftPadProps {
    paletteName: string
    colors: RGBColor[]

    onInputPaletteName: (ev: React.FormEvent<HTMLInputElement>) => void
    onChangeColorsCount: (count: number) => void
}

interface LeftPadState {
  showModal: boolean
  content: string
  includeShades: boolean
}

export class LeftPad extends React.PureComponent<LeftPadProps, LeftPadState> {

  state = {
    showModal: false,
    content: '',
    includeShades: false,
  }

  renderExportModal = () => {
    const methods = exportMethodsArray.map(method => (
      <Card.Grid
        key={method.name}
        className={styles['export-item']}
        // @ts-ignore
        onClick={this.handleExport(method.name)}
      >
        <Icon type={method.icon} className={styles['export-icon']} />
        {method.name.toUpperCase()}
      </Card.Grid>
    ))
    const textArea = this.state.content && (
      <Input.TextArea
        className={styles['export-textarea']}
        value={this.state.content}
        rows={4}
      />)

    return (
      <Modal
        visible={this.state.showModal}
        onCancel={this.toggleModal}
        footer={null}
        title='Export'
      >
        <Card bordered={false}>
          {methods}
          {textArea}
        </Card>
      </Modal>
    )
  }

  renderPaletteSection = () => (
    <Card className={styles['card']} type='inner' size='small' title='Palette'>
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Form.Item className={styles['form-item']} label='Name'>
          <Input
            placeholder='NEW PALETTE'
            value={this.props.paletteName}
            onChange={this.props.onInputPaletteName}
          />
        </Form.Item>
        <Form.Item className={styles['form-item']} label='Count'>
          <Slider
            value={this.props.colors.length}
            step={1}
            max={6}
            min={1}
            onChange={this.props.onChangeColorsCount}
            marks={{ 1: '1', 6 : '6' }}
          />
        </Form.Item>
      </Form>
    </Card>
  )

  renderExportSection = () => (
    <Card className={styles['card']} type='inner' size='small' title='Export'>
      <Checkbox checked={this.state.includeShades} onChange={this.toggleIncludeShades}>Include Shades</Checkbox><br /><br />
      <Button block={true} onClick={this.toggleModal}><Icon type='picture' />Export</Button>
      <Button block={true} onClick={this.handleTweet}><Icon type='twitter' />Tweet</Button>
    </Card>
  )

  render() {
    return (
      <React.Fragment>
        {this.renderPaletteSection()}
        {this.renderExportSection()}
        {this.renderExportModal()}
        {/* { PHLink } */}
        {buyMeCoffee}
      </React.Fragment>
    )
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  toggleIncludeShades = (ev: CheckboxChangeEvent) => {
    this.setState({
      includeShades: ev.target.checked
    })
  }

  handleExport = (method: ExportMethod) => () => {
    const { colors, paletteName } = this.props
    const { includeShades } = this.state
    const content = (
      exportMethods[method] as (colors: RGBColor[], name: string, includeShades: boolean) => string
    )(colors, paletteName || 'New Palette', includeShades)

    if (content) {
      this.setState({
        content
      })
      // @ts-ignore
      navigator.clipboard.writeText(content)
        .then(() => message.success('Successfully copied!'))
        .catch(() => message.warn('Fail to copy automatically, please copy the source on yourself.'))
    } else {
      this.setState({
        content: ''
      })
    }
  }

  handleTweet = () => {
    const { paletteName, colors } = this.props

    const win = window.open(
      twitterShareUrl
        .replace('__URL__', exportMethods['url'](colors, paletteName))
        .replace('__PALETTE_NAME__', paletteName || 'New Palette')
    )

    win!.focus()
  }
}
