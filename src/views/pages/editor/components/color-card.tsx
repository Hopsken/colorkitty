import React from 'react'
import { readable } from '@/utilities'

interface Props {
  color?: ColorSchema
}

export const ColorCard: React.FC<Props> = ({ color }) => {

  if (!color) {
    return null
  }

  const text = color.name ?? color.hex

  return (
    <div className='mx-4 mt-4'>
      <div
        className='relative text-2xl text-white rounded-lg shadow-xs'
        style={ { background: color.hex, paddingTop: '100%' } }
      >
        <span className='absolute inset-0 flex items-center justify-center' style={ { color: readable(color.hex) } }>
          <span>{ text.toUpperCase() }</span>
        </span>
      </div>
    </div>

  )
}
