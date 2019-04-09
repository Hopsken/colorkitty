import { InjectedColorProps, ChromePicker, CustomPicker } from 'react-color'
import { Select, Card, message, Col, Row } from 'antd'
import { readability } from '@ctrl/tinycolor'
import isFunction from 'lodash/isFunction'
import { Color } from 'react-color'
import * as React from 'react'

import { colorCombinations, ColorCombinationType } from '@/utilities'
import { SuppressibleCard } from '../suppressible-card'

const Option = Select.Option
const styles = require('./supre-picker.styl')

interface SuprePickerProps extends InjectedColorProps {}

interface SuprePickerState {
  combinationType: ColorCombinationType
}

interface ColorCombinationProps {
  hex?: string
  type: ColorCombinationType
  onClick?: (color: Color) => void
}

export function CombinationComp({
  type,
  hex,
  onClick
}: ColorCombinationProps) {
  if (!hex) {
    return null
  }

  const handleChange = (color: string) => () => {
    if (onClick && isFunction(onClick)) {
      onClick(color)
    }

    // @ts-ignore
    if (!navigator.clipboard) {
      return
    }
    // @ts-ignore
    navigator.clipboard.writeText(color)
    .then(() => message.success('Copied!'))
  }

  const colorSlides =  (colorCombinations[type](hex) || []).map((one: string, index: number) => {
    return (
      <div
        key={ index }
        className={ styles['slide'] }
        style={ { background: one } }
        onClick={ handleChange(one) }
      >
        <span>{ one.toUpperCase() }</span>
      </div>
    )
  })

  return (
    <div className={ styles['slide-wrapper'] }>
      <div className={ styles['slides'] }>
        { colorSlides }
      </div>
    </div>
  )
}

class SuprePickerComp extends React.PureComponent<SuprePickerProps, SuprePickerState> {

  state: SuprePickerState = {
    combinationType: 'analogous'
  }

  getContainer = () => document.getElementById('sidebar')!

  renderSelector = () => (
    <Select
      style={ { width: 140, marginBottom: 12 } }
      defaultValue='analogous'
      onChange={ this.handleChangeCombineType }
      getPopupContainer={ this.getContainer }
    >
      <Option value='monochromatic'>Monochromatic</Option>
      <Option value='analogous'>Analogous</Option>
      <Option value='triad'>Triad</Option>
      <Option value='tetrad'>Tetrad</Option>
      <Option value='complement'>Complement</Option>
      <Option value='splitcomplement'>Split Complement</Option>
    </Select>
  )

  renderContrast = () => {
    const { hex } = this.props
    if (!hex) {
      return null
    }

    const contrast2White = readability(hex, '#fff')
    const contrast2Black = readability(hex, '#000')

    return (
      <div className={ styles['contrast'] }>
        <Row>
          <Col span={ 8 }>&nbsp;</Col>
          <Col span={ 8 }>White</Col>
          <Col span={ 8 }>Black</Col>
        </Row>
        <Row>
          <Col span={ 8 }>AA</Col>
          <Col span={ 8 }>{ contrast2White >= 4.5 ? '✓' : ' ' }</Col>
          <Col span={ 8 }>{ contrast2Black >= 4.5 ? '✓' : ' ' }</Col>
        </Row>
        <Row>
          <Col span={ 8 }>AAA</Col>
          <Col span={ 8 }>{ contrast2White >= 7 ? '✓' : ' ' }</Col>
          <Col span={ 8 }>{ contrast2Black >= 7 ? '✓' : ' ' }</Col>
        </Row>
        <Row>
          <Col span={ 8 }>Lg AA</Col>
          <Col span={ 8 }>{ contrast2White >= 3 ? '✓' : ' ' }</Col>
          <Col span={ 8 }>{ contrast2Black >= 3 ? '✓' : ' ' }</Col>
        </Row>
        <Row>
          <Col span={ 8 }>Lg AAA</Col>
          <Col span={ 8 }>{ contrast2White >= 4.5 ? '✓' : ' ' }</Col>
          <Col span={ 8 }>{ contrast2Black >= 4.5 ? '✓' : ' ' }</Col>
        </Row>
      </div>
    )
  }

  render() {
    return (
      <div className={ styles['picker'] } id='sidebar'>
        <Card bodyStyle={ { padding: 0 } }>
          <ChromePicker
            { ...this.props }
            disableAlpha={ true }
          />
        </Card>

        <SuppressibleCard className={ styles['card'] } size='small' type='inner' title='Shades'>
          <CombinationComp
            hex={ this.props.hex }
            type='shades'
          />
        </SuppressibleCard>

        <SuppressibleCard className={ styles['card'] }  size='small' type='inner' title='Harmony'>
          { this.renderSelector() }
          <CombinationComp
            hex={ this.props.hex }
            type={ this.state.combinationType }
          />
        </SuppressibleCard>

        <SuppressibleCard className={ styles['card'] }  size='small' type='inner' title='Contrast'>
          { this.renderContrast() }
        </SuppressibleCard>
      </div>
    )
  }

  handleChangeCombineType = (type: ColorCombinationType) => {
    this.setState({
      combinationType: type
    })
  }

}

export const SuprePicker = CustomPicker(SuprePickerComp)
