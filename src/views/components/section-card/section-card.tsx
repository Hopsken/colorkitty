import React from 'react'

export interface Props {
  title: React.ReactNode
  handler?: React.ReactNode
}

export const SectionCard: React.FC<Props> = (props) => {
  return (
    <div className='flex flex-col py-4 border-b border-gray-400 border-solid'>
      <div className='flex items-center justify-between h-10 px-4'>
        <span className='font-medium'>{ props.title }</span>
        <span className='flex'>{ props.handler }</span>
      </div>
      <div>
        { props.children }
      </div>
    </div>
  )
}

export const SectionCardPlaceholder = (props: { placeholder?: string }) => {
  return (
    <div className='flex items-center justify-center h-12 text-sm text-center text-gray-500'>
      <span>{ props.placeholder ?? 'Empty' }</span>
    </div>
  )
}
