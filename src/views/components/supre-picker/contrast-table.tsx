import React from 'react'
import { Dropdown } from 'antd'
import { Color, TwitterPicker, TwitterPickerProps, ColorResult } from 'react-color'
import { readability } from '@ctrl/tinycolor'

import { toHex } from '@/utilities'

const styles = require('./contrast-table.styl')
const readabilityStandard = [
  {
    level: 'AA',
    score: 4.5
  }, {
    level: 'AAA',
    score: 7
  }, {
    level: 'Lg AA',
    score: 3
  }, {
    level: 'Lg AAA',
    score: 4.5
  },
]

interface ContrastTableProps {
  className?: string
  colors: Color[]
  activeColor: Color
}

interface ContrastTableState {
  fstColor: Color
  secColor: Color
}

export class ContrastTable extends React.PureComponent<ContrastTableProps, ContrastTableState> {

  state = {
    fstColor: '#FAFAFA',
    secColor: '#000000',
  }

  renderHead = () => {
    const { fstColor, secColor } = this.state
    const pickProps = {
      triangle: 'top-right' as TwitterPickerProps['triangle'],
      colors: ['#fafafa', '#000'].concat(this.props.colors.map(one => toHex(one)))
    }
    const ths = [fstColor, secColor].map((color, index) => (
      <th key={ index }>
        <Dropdown
          trigger={ ['click'] }
          overlay={ <TwitterPicker { ...pickProps } onChangeComplete={ this.handleChangeColor(index) } color={ color } /> }
        >
          <div className={ styles['contrast-swatch'] }>
            <div style={ { background: toHex(color) } } />
          </div>
        </Dropdown>
      </th>)
    )

    return (
      <thead>
        <tr>
          <th />
          { ths }
        </tr>
      </thead>
    )
  }

  renderBoby = () => {
    const { activeColor } = this.props
    const { fstColor, secColor } = this.state
    const contrastFstColor = readability(activeColor, fstColor)
    const contrastSecColor = readability(activeColor, secColor)

    const rows = readabilityStandard.map(standard => (
      <tr key={ standard.level }>
        <td>{ standard.level }</td>
        <td>{ contrastFstColor >= standard.score ? '✓' : '' }</td>
        <td>{ contrastSecColor >= standard.score ? '✓' : '' }</td>
      </tr>
    ))

    return <tbody>{ rows }</tbody>
  }

  render() {
    const { activeColor } = this.props
    if (!activeColor) {
      return null
    }

    return (
      <table className={ styles.contrast }>
        { this.renderHead() }
        { this.renderBoby() }
      </table>
    )
  }

  handleChangeColor = (index: number) => (color: ColorResult) => {
    switch (index) {
      case 0:
        this.setState({
          fstColor: color.hex
        })
        break
      case 1:
        this.setState({
          secColor: color.hex
        })
        break
    }
  }
}
