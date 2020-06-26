import React, { useCallback } from 'react'
import _ from 'underscore'
import cx from 'classnames'
import { SectionCard, SectionCardPlaceholder } from '@/views/components'
import { Icon } from 'antd'

interface Props {
  activeIndex: number
  colors: ColorSchema[]
  onSelect(index: number): void
  onAddColor?(): void
}

export const ColorList: React.FC<Props> = (props) => {
  const handler = props.onAddColor && (
    <Icon
      type='plus'
      onClick={ props.onAddColor }
    />
  )

  const renderColor = useCallback((color: ColorSchema, index: number) => {
    const onClick = () => props.onSelect(index)
    const cls = cx('flex items-center group h-10 px-4 hover:bg-gray-300', {
      'bg-gray-200': props.activeIndex === index,
    })

    return (
      <li key={ index } className={ cls } onClick={ onClick }>
        <span className='w-6 h-6 rounded' style={ { background: color.hex } } />
        <span className='flex-1 pl-3'>{ color.hex.toUpperCase() }</span>
      </li>
    )
  }, [props.onSelect, props.activeIndex])

  const content = props.colors.length > 0
    ? <ul>{ _.map(props.colors, renderColor) }</ul>
    : <SectionCardPlaceholder />

  return (
    <SectionCard
      title='Colors'
      handler={ handler }
    >
      { content }
    </SectionCard>
  )
}
