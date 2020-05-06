import React, { useMemo } from 'react'
import { Palette } from '@/types'
import { Color } from 'react-color'
import { toHex } from '@/utilities'
import { Icon } from 'antd'

const styles = require('./palette-card.component.styl')
const cx = require('classnames/bind').bind(styles)

interface Props {
  className?: string
  palette: Palette
}

const PaletteColor: React.FC<{
  color: Color
  displayHex?: boolean
}> = React.memo(({ color, displayHex = false }) => {
  const hex = toHex(color).toUpperCase()
  const style = { backgroundColor: hex }

  const hexSpan = displayHex && <span className={styles['text']}>{hex}</span>

  return (
    <div className={styles['color']} style={style}>
      {hexSpan}
    </div>
  )
})

export const PaletteCard: React.FC<Props> = ({ palette, className }) => {
  const cls = cx(styles['wrapper'], className)

  const colors = palette.colors.map((color, index) => {
    return <PaletteColor key={index} color={color} />
  })

  const heartIcon = useMemo(() => {
    return (
      <span className={styles['btn-heart']}>
        <Icon type="heart" theme="outlined" />
        Like
      </span>
    )
  }, [])

  return (
    <div className={cls}>
      <div className={styles['card']}>
        <div className={styles['colors-wrapper']}>{colors}</div>
        {heartIcon}
      </div>
    </div>
  )
}
