import React, { useCallback } from 'react'
import { Layout, Input } from 'antd'

interface Props {
  name: string
  onChangeName(name: string): void
}

export const Header: React.FC<Props> = (props) => {
  const onChangeName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChangeName(event.currentTarget.value)
  }, [props.onChangeName])

  return (
    <Layout.Header className='fixed inset-x-0 top-0 h-16 text-white bg-gray-900'>
      <div className="absolute inset-0 text-center">
        <Input className='w-24 text-white bg-transparent border-none outline-none focus:border-none' value={ props.name } onChange={ onChangeName } />
      </div>
      <div className='flex justify-between'>
        <div>
          SELECT
        </div>
        <div>
          L L F
        </div>
      </div>
    </Layout.Header>
  )
}
