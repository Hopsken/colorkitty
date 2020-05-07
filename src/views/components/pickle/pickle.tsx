import * as React from 'react'

import { readable } from '@/utilities'
const styles = require('./pickle.styl')

interface Props extends React.BaseHTMLAttributes<HTMLDivElement> {
  size: number
  color: string
  index: number
}

export const Pickle = (props: Props) => {

  const { size = 20, color = '#333', index, className, style, ...others } = props

  const pickleStyle = {
    width: size,
    height: size * 1.375,
  }
  const triangleStyle = {
    top: size * 0.5,
    left: 0 - (size * 0.1),
    borderWidth: `${size * 0.875}px ${size * 0.6}px`,
  }
  const circleStyle = {
    height: size,
    width: size,
    lineHeight: `${size * 0.75}px`,
    textAlign: 'center' as React.CSSProperties['textAlign'],
    fontWeight: 700,
    backgroundColor: color,
    color: readable(color)
  }

  return (
    <div
      {...others}
      className={`${styles.pickle} ${className}`}
      style={{ ...pickleStyle, ...style }}
    >
      <span className={styles.triangle} style={triangleStyle} />
      <span className={styles.circle} style={circleStyle}>{index}</span>
    </div>
  )
}
