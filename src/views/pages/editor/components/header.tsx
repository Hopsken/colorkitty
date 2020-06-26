import React, { useCallback } from 'react'
import { Layout, Input, Button, Icon, Dropdown, Menu, Modal } from 'antd'

const { confirm } = Modal

interface Props {
  name: string
  onChangeName(name: string): void
  onSave(): void
  onReset(): void
}

export const Header: React.FC<Props> = (props) => {
  const onChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChangeName(event.currentTarget.value)
  }, [props.onChangeName])

  const onClickReset = useCallback(() => {
    confirm({
      title: 'Are you sure reset this document?',
      content: 'All the palettes and colors of this document will be cleared. After that, you can pick another image.',
      okType: 'danger',
      onOk: props.onReset
    })
  }, [props.onReset])

  const menu = (
    <Menu className='w-48 text-white' theme='dark'>
      <Menu.Item className='text-white' onClick={ onClickReset } >
        Reset
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout.Header className='fixed inset-x-0 top-0 h-16 px-8 text-white bg-gray-900'>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <Input className='w-24 text-white bg-transparent border-none outline-none focus:border-none' value={ props.name } onChange={ onChangeName } />
        <Dropdown overlay={ menu } trigger={ ['click'] } placement='bottomCenter'>
          <Icon type='down' />
        </Dropdown>
      </div>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <Icon type='menu' />
        </div>
        <div>
          <Button type='primary' onClick={ props.onSave }>
            Save
          </Button>
        </div>
      </div>
    </Layout.Header>
  )
}
