import { Select, Tooltip, message, Icon } from 'antd'
import * as React from 'react'

import { colorCombinations, ColorCombinationType, readable } from '@/utilities'
import { SuppressibleCard } from '../suppressible-card'
import { ContrastTable } from './contrast-table'

const Option = Select.Option

const contrastTitle = (
  <span className='flex items-center'>
    <span className='mr-2'>Contrast</span>
    <a className='flex items-center' target='_blank' href='https://webaim.org/articles/contrast/'>
      <Icon type='question-circle' />
    </a>
  </span>
)

interface SuprePickerState {
  combinationType: ColorCombinationType
}

interface ColorCombinationProps {
  hex: string
  type: ColorCombinationType
}

export const ColorCombine: React.FC<ColorCombinationProps> = React.memo((props) => {
  const { hex, type } = props

  const onClick = (color: string) => () => {
    if (!navigator.clipboard) {
      return
    }
    navigator.clipboard.writeText(color)
      .then(() => message.success('Copied!'))
  }

  const colorSlides = (colorCombinations[type](hex) || []).map((one: string, index: number) => {
    return (
      <Tooltip key={ index } title={ one.toUpperCase() }>
        <span
          className='flex-1 h-4 mr-1'
          style={ { background: one, color: readable(one) } }
          onClick={ onClick(one) }
        />
      </Tooltip>
    )
  })

  return (
    <div className='flex mx-4'>
      { colorSlides }
    </div>
  )
})

export class ColorPanels extends React.PureComponent<{ hex: string }, SuprePickerState> {

  state = {
    combinationType: 'analogous' as ColorCombinationType,
  }

  getContainer = () => document.getElementById('sidebar')!

  renderSelector = () => (
    <Select
      className='w-auto mb-3 ml-4'
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
      <div>
        <SuppressibleCard title='Shades'>
          <ColorCombine
            hex={ this.props.hex }
            type='shades'
          />
        </SuppressibleCard>

        <SuppressibleCard title='Harmony'>
          { this.renderSelector() }
          <ColorCombine
            hex={ this.props.hex }
            type={ this.state.combinationType }
          />
        </SuppressibleCard>

        <SuppressibleCard title={ contrastTitle }>
          <div className='mx-4'>
            <ContrastTable colors={ [] } activeColor={ this.props.hex! } />
          </div>
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
