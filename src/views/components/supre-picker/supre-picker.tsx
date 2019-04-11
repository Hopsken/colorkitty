import { InjectedColorProps, ChromePicker, CustomPicker } from 'react-color'
import { Select, Card, message, Icon } from 'antd'
import isFunction from 'lodash/isFunction'
import { Color } from 'react-color'
import * as React from 'react'

import { colorCombinations, ColorCombinationType, readable } from '@/utilities'
import { SuppressibleCard } from '../suppressible-card'
import { ContrastTable } from './contrast-table'

const Option = Select.Option
const styles = require('./supre-picker.styl')
const contrastTitle = (
  <span>
    Contrast&nbsp;&nbsp;
    <a target='_blank' href='https://webaim.org/articles/contrast/'>
      <Icon type='question-circle' />
    </a>
  </span>
)

interface SuprePickerProps extends InjectedColorProps {
  colors: Color[]
}

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
        style={ { background: one, color: readable(one) } }
        onClick={ handleChange(one) }
      >
        <span>{ one.toUpperCase() }</span>
      </div>
    )
  })

  return (
    <div className={ styles['slides'] }>
      { colorSlides }
    </div>
  )
}

class SuprePickerComp extends React.PureComponent<SuprePickerProps, SuprePickerState> {

  state = {
    combinationType: 'analogous' as ColorCombinationType,
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

        <SuppressibleCard className={ styles['card'] }  size='small' type='inner' title={ contrastTitle }>
          <ContrastTable colors={ this.props.colors } activeColor={ this.props.hex! } />
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
