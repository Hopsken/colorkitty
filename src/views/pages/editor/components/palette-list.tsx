import React, { useCallback, useState } from "react";
import _ from 'underscore'
import { SectionCard, SectionCardPlaceholder } from '@/views/components';
import { Icon, Menu, Dropdown } from 'antd';

interface Props {
  selected?: string
  palettes: PaletteSchema[]
  onClickAdd?(): void
  onSelect(id: string): void
  onDelete(id: string): void
  onRename(id: string, name: string): void
}

interface ItemProps {
  isSelected: boolean
  palette: PaletteSchema
  onSelect(id: string): void
  onDelete(id: string): void
  onRename(id: string, name: string): void
}

const PaletteItem: React.FC<ItemProps> = React.memo((props) => {
  const onClickDelete = () => props.onDelete(props.palette.id)
  const onClick = () => props.onSelect(props.palette.id)

  const [state, setState] = useState({
    name: props.palette.name,
    editing: false,
  })

  const onClickRename = useCallback(() => {
    setState((cur) => ({ ...cur, editing: true }))
  }, [])

  const onChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      editing: true,
      name: event.currentTarget.value,
    })
  }, [])

  const onConfirmName = useCallback(() => {
    props.onRename(props.palette.id, state.name)
    setState({ editing: false, name: state.name })
  }, [state.name, props.palette, props.onRename])

  const onEnter = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode !== 13) { return }
    onConfirmName()
  }, [onConfirmName])

  const menu = (
    <Menu className='w-24'>
      <Menu.Item key='1' onClick={ onClickRename }>
        Rename
      </Menu.Item>
      <Menu.Item key='2' onClick={ onClickDelete }>
        Delete
      </Menu.Item>
    </Menu>
  )

  const tick = props.isSelected && <Icon className='absolute inset-y-0 left-0 pt-3 pl-4 text-xs' type='check' />

  const nameEl = state.editing
    ? (
      <input
        autoFocus={ true }
        autoComplete=''
        className='border border-blue-600'
        value={ state.name }
        onChange={ onChangeName }
        onKeyDown={ onEnter }
        onBlur={ onConfirmName }
      />
    )
    : <span>{ props.palette.name }</span>

  return (
    <Dropdown overlay={ menu } trigger={ ['contextMenu'] }>
      <li onClick={ onClick } className='relative flex items-center h-8 pl-10 hover:bg-gray-300'>
        { tick }
        { nameEl }
      </li>
    </Dropdown>
  )
})

export const PaletteList: React.FC<Props> = (props) => {
  const handler = props.onClickAdd && (
    <Icon
      type='plus'
      onClick={ props.onClickAdd }
    />
  )

  const renderItem = useCallback((palette: PaletteSchema) => {
    const isSelected = props.selected === palette.id

    return (
      <PaletteItem
        key={ palette.id }
        palette={ palette }
        isSelected={ isSelected }
        onDelete={ props.onDelete }
        onRename={ props.onRename }
        onSelect={ props.onSelect }
      />
    )
  }, [props.selected, props.onSelect, props.onDelete])

  const content = props.palettes.length > 0
    ? <ul>{ _.map(props.palettes, renderItem) }</ul>
    : <SectionCardPlaceholder />

  return (
    <SectionCard title='Palettes' handler={ handler }>
      { content }
    </SectionCard>
  )
}
