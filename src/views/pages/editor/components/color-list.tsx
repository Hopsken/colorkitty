import React, { useCallback, useState } from 'react'
import _ from 'underscore'
import cx from 'classnames'
import { SectionCard, SectionCardPlaceholder } from '@/views/components'

interface Props {
  colors: ColorSchema[]
  onSelect(color: ColorSchema): void
}

export const ColorList: React.FC<Props> = (props) => {
  const [ selected, setSelected ] = useState(0)

  const onSelectColor = useCallback((index: number) => {
    props.onSelect(props.colors[index])
    setSelected(index)
  }, [props.colors, props.onSelect])

  const renderColor = useCallback((color: ColorSchema, index: number) => {
    const onClick = () => onSelectColor(index)
    const cls = cx('flex items-center h-10 px-4 hover:bg-gray-300', {
      'bg-gray-200': selected === index,
    })

    return (
      <li key={ index } className={ cls } onClick={ onClick }>
        <span className='w-6 h-6 rounded' style={ { background: color.hex } } />
        <span className='pl-3'>{ color.hex.toUpperCase() }</span>
      </li>
    )
  }, [onSelectColor, selected])

  const content = props.colors.length > 0
    ? <ul>{ _.map(props.colors, renderColor) }</ul>
    : <SectionCardPlaceholder />

  return (
    <SectionCard
      title='Colors'
    >
      { content }
    </SectionCard>
  )
}
