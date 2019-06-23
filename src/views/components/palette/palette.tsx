import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { Button, Upload, Tooltip, Modal, Input, Icon, message } from 'antd'
import arrayMove from 'array-move'
import { Color } from 'react-color'
import * as React from 'react'
import copy from 'copy-to-clipboard'

import { toHex, toRGBString, readable, iSValidURL } from '@/utilities'

const styles = require('./palette.styl')
const cx = require('classnames/bind').bind(styles)

interface Props {
  colors: Color[]
  paletteName: string
  currentIndex: number

  updateColors: (colors: Color[]) => void
  onClickColor: (index: number) => void
  onUploadImage: (file: File | string) => boolean
}

interface State {
  showUploadModal: boolean
}

interface SortableColorItemProps {
  color: Color
  length: number
  isActive: boolean
  handleClickColor: () => void
}

interface SortableColorListProps {
  colors: Color[]
  currentIndex: number
  handleClick: (index: number) => () => void
}

const copyColorToClipboard = (text: string) => () => {
  if (copy(text)) {
    message.success('Successfully copied!')
  }
}
const SortableColorItem = SortableElement(({
  color,
  length,
  isActive,
  handleClickColor
}: SortableColorItemProps) => (
    <div
      className={ cx('c', `c-${length}`, { active: isActive }) }
      style={ { backgroundColor: toRGBString(color) } }
      onClick={ handleClickColor }
    >
      <span style={ { color: readable(color) } } onClick={ copyColorToClipboard(toHex(color)) }>{ toHex(color).toUpperCase() }</span>
    </div>
  )
)

const SortableColorList = SortableContainer(({
  colors,
  handleClick,
  currentIndex,
}: SortableColorListProps) => {
  const items = colors.map((color: any, index: number, all: any) => (
    <SortableColorItem
      key={ `color-${index}` }
      index={ index }
      color={ color }
      isActive={ currentIndex === index }
      length={ all.length }
      handleClickColor={ handleClick(index) }
    />)
  )

  return (
    <div className={ styles['palette-colors'] } >
      { items }
    </div>)
})

export class Palette extends React.PureComponent<Props, State> {

  state = {
    showUploadModal: false
  }

  renderColor = (
    color: Color,
    index: number,
    colors: Color[]
  ) => (
      <div
        key={ index }
        className={ cx('c', `c-${colors.length}`) }
        style={ { backgroundColor: toRGBString(color) } }
        onClick={ this.handleClickColor(index) }
      >
        <span>{ toHex(color).toUpperCase() }</span>
      </div>
    )

  renderPalette = () => (
    <SortableColorList
      axis='x'
      lockAxis='x'
      currentIndex={ this.props.currentIndex }
      colors={ this.props.colors }
      handleClick={ this.handleClickColor }
      onSortEnd={ this.handleDragColorEnd }
      distance={ 10 }
      lockToContainerEdges={ true }
    />
  )

  renderBottom = () => (
    <div className={ styles['palette-info'] }>
      <span className={ styles['palette-name'] }>{ this.props.paletteName || 'NEW PALETTE' }</span>

      <div className={ styles['palette-control'] }>
        <Tooltip title='Pick colors from Image'>
          <Button icon='camera' onClick={ this.toggleUploadModal }>Upload</Button>
        </Tooltip>
      </div>
    </div>
  )

  renderUploadModal = () => {
    return (
      <Modal
        footer={ null }
        title='Pick colors from image'
        visible={ this.state.showUploadModal }
        onCancel={ this.toggleUploadModal }
      >
        <Upload.Dragger
          accept={ 'image/*' }
          beforeUpload={ this.handleUpload }
          showUploadList={ false }
          className={ styles['upload-dragger'] }
        >
          <div className={ styles['upload-dragger-container'] }>
            <Icon className={ styles['upload-dragger-icon'] } type='inbox' />
            <p className={ styles['upload-dragger-info'] }>Browse or drag image</p>
          </div>
        </Upload.Dragger>
        <p className={ styles['upload-remote-title'] }>Remote Image</p>
        <Input.Search
          placeholder='https://'
          enterButton='Confirm'
          onSearch={ this.handleConfirmRemoteImage }
          pattern='https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)'
        />
      </Modal>
    )
  }

  render() {
    return (
      <section className={ styles['palette'] }>
        { this.renderPalette() }
        { this.renderBottom() }
        { this.renderUploadModal() }
      </section>
    )
  }

  toggleUploadModal = () => {
    this.setState({
      showUploadModal: !this.state.showUploadModal
    })
  }

  handleClickColor = (index: number) => () => {
    this.props.onClickColor(index)
  }

  handleDragColorEnd = ({ oldIndex, newIndex }: {
    oldIndex: number,
    newIndex: number
  }) => {
    this.props.updateColors(
      arrayMove(this.props.colors, oldIndex, newIndex)
    )
  }

  handleUpload = (file: File) => {
    this.props.onUploadImage(file)
    this.toggleUploadModal()
    return false
  }

  handleConfirmRemoteImage = (url: string) => {
    if (iSValidURL(url)) {
      this.props.onUploadImage(url)
      this.toggleUploadModal()
    } else {
      message.warning('The image url is not valid.')
    }
  }
}
