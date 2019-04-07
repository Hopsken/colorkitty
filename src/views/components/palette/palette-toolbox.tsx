import * as React from 'react'
import { RGBColor } from 'react-color'
import {
  Button, Icon,
  Modal, Card, Input, message
} from 'antd'

import { exportMethods } from '@/utilities'

interface Props {
  colors: RGBColor[]
  paletteName: string
}

interface State {
  showModal: boolean
  content: string
}

enum ExportMethod {
  URL = 'url',
  PNG = 'png',
  SCSS = 'scss',
  JSON = 'json',
  HEX = 'hex'
}

const styles = require('./palette-toolbox.styl')
const twitterShareUrl = 'https://twitter.com/intent/tweet?'
  + 'orginal_referer=https://colorkitty.com&button_hashtag=colorkitty'
  + '&url=https://colorkitty.com&text=Extract perfect palettes from delicious pictures.'
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

export class PaletteToolbox extends React.PureComponent<Props, State> {

  state = {
    showModal: false,
    content: ''
  }

  renderExportModal = () => {
    const methods = exportMethodsArray.map(method => (
      <Card.Grid
        key={ method.name }
        className={ styles['export-item'] }
        // @ts-ignore
        onClick={ this.handleExport(method.name) }
      >
        <Icon type={ method.icon } className={ styles['export-icon'] } />
        { method.name.toUpperCase() }
      </Card.Grid>
    ))
    const textArea = this.state.content && (
      <Input.TextArea
        className={ styles['export-textarea'] }
        value={ this.state.content }
        rows={ 4 }
      />)

    return (
      <Modal
        visible={ this.state.showModal }
        onCancel={ this.toggleModal }
        footer={ null }
        title='Export'
        bodyStyle={ { padding: 0 } }
      >
        <Card bordered={ false }>
          { methods }
          { textArea }
        </Card>
      </Modal>
    )
  }

  render() {
    return (
      <div className={ styles['toolbox'] }>
        <Button
          onClick={ this.toggleModal }
        >
          <Icon type='picture' />Export
        </Button>
        <Button href={ twitterShareUrl }>
          <Icon type='twitter' />Tweet
        </Button>

        { this.renderExportModal() }
      </div>
    )
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  handleExport = (method: ExportMethod) => () => {
    const { colors, paletteName } = this.props
    const content = exportMethods[method](colors, paletteName || 'New Palette')

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
}
