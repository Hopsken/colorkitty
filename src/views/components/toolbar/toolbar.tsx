import * as React from 'react'
import { RGBColor } from 'react-color'
import { Icon, Tooltip, message, Card, Input, Modal, Checkbox } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import copy from 'copy-to-clipboard'

import { ExportMethod, exportMethods } from '@/utilities'

const styles = require('./toolbar.styl')
const cx = require('classnames').bind(styles)

interface ToolbarProps {
  paletteName: string
  colors: RGBColor[]

  onChangeColorsCount: (count: number) => void
}

interface ToolbarState {
  showModal: boolean
  content: string
  includeShades: boolean
}

const twitterShareUrl = 'https://twitter.com/intent/tweet?'
  + 'button_hashtag=colorkitty'
  + '&url=__URL__&text=Palette: __PALETTE_NAME__.'
const exportMethodsArray = [
  {
    name: ExportMethod.SVG,
    icon: 'block'
  }, {
    name: ExportMethod.PNG,
    icon: 'picture'
  }, {
    name: ExportMethod.URL,
    icon: 'link'
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
    showModal: false,
    content: '',
    includeShades: false,
  }

  renderExportModal = () => {
    const methods = exportMethodsArray.map(method => {
      const iconCls = cx(styles['export-icon'], {[styles.active]: method.name === ExportMethod.SVG})
      return (
        <Card.Grid
          key={method.name}
          // @ts-ignore
          onClick={this.handleExport(method.name)}
        >
          <Icon type={method.icon} className={iconCls} />
          {method.name.toUpperCase()}
        </Card.Grid>
      )
    })
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
        <p className={styles['export-tips']}>
          Using <span className={styles.active}>SVG</span> format,
          you can copy-paste your palette to any prototyping tools like Sketch, Figma, and Adobe XD.
        </p>
        <Card bodyStyle={{ padding: 0 }} bordered={false}>
          {methods}
          {textArea}
        </Card>
      </Modal>
    )
  }

  render() {
    return (
      <div className={styles.toolbar}>
        <Tooltip placement='left' title='Add color'>
          <div className={styles.item} onClick={this.handleAddColor}>
            <Icon type='plus' />
          </div>
        </Tooltip>
        <Tooltip placement='left' title='Remove color'>
          <div className={styles.item} onClick={this.handleRemoveColor}>
            <Icon type='minus' />
          </div>
        </Tooltip>
        <Tooltip placement='left' title='Export'>
          <div className={styles.item} onClick={this.toggleModal}>
            <Icon type='share-alt' />
          </div>
        </Tooltip>
        <Tooltip placement='left' title='Share'>
          <div className={styles.item} onClick={this.handleTweet}>
            <Icon type='twitter' />
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
        .replace('__URL__', exportMethods.url(colors, paletteName))
        .replace('__PALETTE_NAME__', paletteName || 'New Palette')
    )

    win!.focus()
  }
}
