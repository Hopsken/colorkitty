import * as React from 'react'
import { RGBColor } from 'react-color'
import { Icon, Tooltip, message, Card, Input, Modal, Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import copy from 'copy-to-clipboard'

import { ExportMethod, exportMethods } from '@/utilities'
import { SavePalettePayload } from '@/services'

interface ToolbarProps {
  paletteName: string
  colors: RGBColor[]

  onChangeColorsCount: (count: number) => void
  onSavePalette: (payload: SavePalettePayload) => void
}

interface ToolbarState {
  isSaving: boolean
  showModal: boolean
  content: string
  includeShades: boolean
}

const styles = require('./toolbar.styl')
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

export class Toolbar extends React.PureComponent<ToolbarProps, ToolbarState> {

  state = {
    isSaving: false,
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
        <Checkbox checked={this.state.includeShades} onChange={this.toggleIncludeShades}>Include Shades</Checkbox>
        <br /><br />
        <Card bodyStyle={{ padding: 0 }} bordered={false}>
          {methods}
          {textArea}
        </Card>
      </Modal>
    )
  }

  render() {
    const { isSaving } = this.state
    return (
      <div className={styles['toolbar']}>
        <Tooltip placement='left' title='Add color'>
          <div className={styles['item']} onClick={this.handleAddColor}>
            <Icon type='plus' />
          </div>
        </Tooltip>
        <Tooltip placement='left' title='Remove color'>
          <div className={styles['item']} onClick={this.handleRemoveColor}>
            <Icon type='minus' />
          </div>
        </Tooltip>
        <Tooltip placement='left' title='Download'>
          <div className={styles['item']} onClick={this.toggleModal}>
            <Icon type='download' />
          </div>
        </Tooltip>
        <Tooltip placement='left' title='Share'>
          <div className={styles['item']} onClick={this.handleTweet}>
            <Icon type='twitter' />
          </div>
        </Tooltip>
        <Tooltip placement='left' title='Save'>
          <div className={styles['item']} onClick={this.handleSavePalette}>
            <Icon type={isSaving ? 'loading' : 'cloud-upload'} />
          </div>
        </Tooltip>

        {this.renderExportModal()}
      </div>
    )
  }

  handleAddColor = () => {
    const length = this.props.colors.length
    if (length >= 6) {
      message.info('Palette can only have at most 6 colors.')
      return
    }
    this.props.onChangeColorsCount(this.props.colors.length + 1)
  }

  handleRemoveColor = () => {
    const length = this.props.colors.length
    if (length <= 1) {
      message.info('Palette should have at least 1 color.')
      return
    }
    this.props.onChangeColorsCount(this.props.colors.length - 1)
  }

  handleSavePalette = () => {
    const { colors, paletteName, onSavePalette } = this.props
    if (!onSavePalette || this.state.isSaving) {
      return
    }
    this.setState({
      isSaving: true
    }, () => {
      onSavePalette({
        colors: colors,
        name: paletteName,
      })
    })
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
      if (copy(content)) {
        message.success('Successfully copied!')
      } else {
        message.warn('Fail to copy automatically, you can copy the text below instead.')
      }
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
