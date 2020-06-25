import React, { useCallback, useMemo } from 'react'
import _ from 'underscore'
import { TinyColor } from '@ctrl/tinycolor'
import { SectionCard } from '@/views/components'

interface Props {
  color?: ColorSchema
}

export const ColorInfo: React.FC<Props> = ({ color }) => {
  const renderItem = useCallback((label: string, content: Array<string | number>) => {
    const renderOne = (item: string | number, index: number) => {
      const text = typeof item === 'number' ? item.toFixed(0) : item
      return (
        <span
          key={ index }
          className='flex-1 px-1 mx-1 border rounded'
        >
          { text }
        </span>
      )
    }
    return (
      <li key={ label } className='flex items-center'>
        <span className='flex-shrink-0 w-1/5 h-8 font-medium leading-loose'>
          { label }
        </span>
        <span className='flex flex-1'>
          { _.map(content, renderOne) }
        </span>
      </li>
    )
  }, [])

  const items = useMemo(() => {
    if (!color) {
      return []
    }

    const tinyColor = new TinyColor(color.hex)
    const rgb = tinyColor.toRgb()
    const hsl = tinyColor.toHsl()
    const hsv = tinyColor.toHsv()
    return [
      {
        label: 'Hex',
        content: [color.hex],
      },
      {
        label: 'RGB',
        content: [rgb.r, rgb.g, rgb.b]
      },
      {
        label: 'HSL',
        content: [hsl.h, hsl.s, hsl.l]
      },
      {
        label: 'HSV',
        content: [hsv.h, hsv.s, hsv.v],
      }
    ]
  }, [color])

  if (!color) {
    return null
  }

  return (

    <SectionCard
      title='Swatch'
    >
      <ul className='px-4'>
        { _.map(items, (item) => renderItem(item.label, item.content)) }
      </ul>
    </SectionCard>
  )
}
