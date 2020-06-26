import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react'
import { Uploader } from './uploader'
import { Spin } from 'antd'
import Draggable, { DraggableData } from 'react-draggable'
import { Pickle } from '@/views/components'
import { toHex } from '@/utilities'

interface Props {
  readonly loading: boolean
  readonly imageSize?: FrameSize
  readonly imageData?: ImageData
  readonly currentColor?: ColorSchema

  onUpdateColorPos(pos: ColorSchema['pos']): void
  onSelectFile(file: File): void
  getColorAtPos(pos: ColorSchema['pos']): RGBColor | undefined
}

interface CoreProps {
  readonly imageSize: FrameSize
  readonly imageData: ImageData
  readonly currentColor?: ColorSchema

  onUpdateColorPos(pos: ColorSchema['pos']): void
  getColorAtPos(pos: ColorSchema['pos']): RGBColor | undefined
}

const CorePainter: React.FC<CoreProps> = (props) => {
  const { imageData, imageSize, currentColor } = props

  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvas.current) {
      return
    }

    const ctx = canvas.current.getContext('2d')

    if (!ctx) { return }

    ctx.putImageData(imageData, 0, 0)
  }, [imageData])

  const pickle = currentColor && (
    <DraggablePickle
      color={ currentColor }
      canvasSize={ imageSize }
      onDrag={ props.onUpdateColorPos }
      getColorAtPos={ props.getColorAtPos }
    />
  )

  return (
    <div className='relative'>
      <canvas ref={ canvas } width={ imageSize.width } height={ imageSize.height } />
      { pickle }
    </div>
  )
}

const DraggablePickle: React.FC<{
  color: ColorSchema,
  canvasSize: FrameSize,
  onDrag(offset: ColorSchema['pos']): void
  getColorAtPos(pos: ColorSchema['pos']): RGBColor | undefined
}> = ({ color, canvasSize, onDrag, getColorAtPos }) => {
  const [hex, setHex] = useState(color.hex)
  const enhanced = false

  useEffect(() => {
    setHex(color.hex)
  }, [color.hex])

  const pickleStyle = useMemo(() => ({
    top: -55,
    left: -20,
  }), [])

  const bounds = useMemo(() => ({
    left: 0,
    top: 0,
    right: canvasSize.width,
    bottom: canvasSize.height,
  }), [canvasSize])

  const position = useMemo(() => {
    const [x, y] = color.pos || [50, 50]
    return {
      x: x / 100 * canvasSize.width,
      y: y / 100 * canvasSize.height,
    }
  }, [color, canvasSize])

  const getPercent = useCallback((offset: number, bound: number) => {
    const percent = Number((offset/bound).toFixed(4))
    if (percent <0) { return 0 }
    if (percent >1) { return 1 }
    return percent * 100 // 0<=x<=100
  }, [])

  const handleDragPickle = useCallback((_: MouseEvent, data: DraggableData) => {
    const pos: ColorSchema['pos'] = [
      getPercent(data.x, canvasSize.width),
      getPercent(data.y, canvasSize.height),
    ]

    onDrag(pos)

    const newColor = getColorAtPos(pos)
    if (!newColor) { return }
    setHex(toHex(newColor) as string)
  }, [onDrag, canvasSize, getColorAtPos])

  const handleDragLocally = useCallback((_: MouseEvent, data: DraggableData) => {
    const pos: ColorSchema['pos'] = [
      getPercent(data.x, canvasSize.width),
      getPercent(data.y, canvasSize.height),
    ]
    const newColor = getColorAtPos(pos)
    if (!newColor) { return }
    setHex(toHex(newColor) as string)
  }, [canvasSize, getColorAtPos])

  return (
    <Draggable
      bounds={ bounds }
      position={ position }
      onDrag={ enhanced ? handleDragPickle : handleDragLocally }
      onStop={ handleDragPickle }
    >
      <Pickle
        size={ 40 }
        color={ hex }
        style={ pickleStyle }
      />
    </Draggable>
  )
}

export const Painter: React.FC<Props> = (props) => {
  if (props.loading) {
    return <Spin />
  }

  if (!props.imageData || !props.imageSize) {
    return <Uploader onSelectFile={ props.onSelectFile } />
  }

  return (
    <CorePainter
      currentColor={ props.currentColor }
      imageData={ props.imageData }
      imageSize={ props.imageSize }
      onUpdateColorPos={ props.onUpdateColorPos }
      getColorAtPos={ props.getColorAtPos }
    />
  )
}
