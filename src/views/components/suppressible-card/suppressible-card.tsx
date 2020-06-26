import React, { useState, useCallback } from 'react'
import { SectionCard, Props as SectionCardProps } from '../section-card'
import { Icon } from 'antd'

interface Props extends SectionCardProps {
  defaultVisible?: boolean
}

export const SuppressibleCard: React.FC<Props> = React.memo((props) => {
  const { defaultVisible, ...rest } = props
  const [ visible, setVisible ] = useState(props.defaultVisible ?? false)

  const toggle = useCallback(() => {
    setVisible(state => !state)
  }, [])

  const icon = (
    <Icon
        type={visible ? 'eye' : 'eye-invisible'}
        onClick={toggle}
    />
  )

  return (
    <SectionCard { ...rest } handler={ icon }>
      { visible ? props.children : null }
    </SectionCard>
  )
})

