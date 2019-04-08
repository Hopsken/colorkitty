import * as React from 'react'
import { Select, Card, message } from 'antd'
import { Color } from 'react-color'
import { InjectedColorProps, ChromePicker, CustomPicker } from 'react-color'

import { colorCombinations, ColorCombinationType } from '@/utilities'
import isFunction from 'lodash/isFunction'

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
      style={ { width: 140 } }
      defaultValue='analogous'
      onChange={ this.handleChangeCombineType }
      getPopupContainer={ this.getContainer }
    >
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
        <Card bodyStyle={ { padding: 0 } } >
          <ChromePicker
            { ...this.props }
            disableAlpha={ true }
          />
        </Card>

        <Card className={ styles['card'] } size='small' type='inner' title='Shades'>
          <CombinationComp
            hex={ this.props.hex }
            type='monochromatic'
          />
        </Card>

        <Card className={ styles['card'] }  size='small' type='inner' title='Harmony' extra={ this.renderSelector() }>
          <CombinationComp
            hex={ this.props.hex }
            type={ this.state.combinationType }
          />
        </Card>
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
