import React, { useCallback } from "react";
import _ from 'underscore'
import { SectionCard, SectionCardPlaceholder } from '@/views/components';
import { Icon } from 'antd';

interface Props {
  selected?: string
  palettes: PaletteSchema[]
  onClickAdd(): void
  onSelect(id: string): void
}

export const PaletteList: React.FC<Props> = (props) => {
  const handler = (
    <Icon
      type='plus'
      onClick={ props.onClickAdd }
    />
  )

  const renderItem = useCallback((palette: PaletteSchema) => {
    const isSelected = props.selected === palette.id
    const tick = <Icon className='absolute inset-y-0 left-0 pt-3 pl-4 text-xs' type='check' />
    const onClick = () => props.onSelect(palette.id)

    return (
      <li key={ palette.id } onClick={ onClick } className='relative flex items-center h-8 pl-10 hover:bg-gray-300'>
        { isSelected && tick }
        <span>{ palette.name }</span>
      </li>
    )
  }, [props.selected, props.onSelect])

  const content = props.palettes.length > 0
    ? <ul>{ _.map(props.palettes, renderItem) }</ul>
    : <SectionCardPlaceholder />

  return (
    <SectionCard title='Palettes' handler={ handler }>
      { content }
    </SectionCard>
  )
}
