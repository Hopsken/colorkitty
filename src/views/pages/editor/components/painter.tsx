import React, { useRef, useEffect, useMemo, useCallback } from 'react'
import { Uploader } from './uploader'
import { Spin } from 'antd'
import Draggable, { DraggableData } from 'react-draggable'
import { Pickle } from '@/views/components'

interface Props {
  readonly loading: boolean
  readonly imageSize?: FrameSize
  readonly imageData?: ImageData
  readonly currentColor?: ColorSchema

  onUpdateColorPos(pos: readonly [number, number]): void
  onSelectFile(file: File): void
}

interface CoreProps {
  readonly imageSize: FrameSize
  readonly imageData: ImageData
  readonly currentColor?: ColorSchema

  onUpdateColorPos(pos: readonly [number, number]): void
}

const CorePainter: React.FC<CoreProps> = (props) => {
  const { imageData, imageSize, currentColor, onUpdateColorPos } = props

  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvas.current) {
      return
    }

    const ctx = canvas.current.getContext('2d')

    if (!ctx) { return }

    ctx.putImageData(imageData, 0, 0)
  }, [imageData])


  const getPos = useCallback((offset: number, bound: number) => {
    const percent = Number((offset/bound).toFixed(4))
    if (percent <0) { return 0 }
    if (percent >1) { return 1 }
    return percent * 100 // 0<=x<=100
  }, [])

  const handleDragPickle = useCallback((offset: readonly [number, number]) => {
    const pos = [
      getPos(offset[0], imageSize.width),
      getPos(offset[1], imageSize.height)
    ] as const

    onUpdateColorPos(pos)
  }, [onUpdateColorPos, imageSize, getPos])

  const pickle = currentColor && (
    <DraggablePickle
      color={ currentColor }
      canvasSize={ imageSize }
      onDrag={ handleDragPickle }
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
  onDrag(offset: readonly [number, number]): void
}> = ({ color, canvasSize, onDrag }) => {
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

  const defaultPos = useMemo(() => {
    const [x, y] = color.pos || [0.5, 0.5]
    return {
      x: x * canvasSize.width,
      y: y * canvasSize.height,
    }
  }, [color, canvasSize])

  const handleDragPickle = useCallback((_: MouseEvent, data: DraggableData) => {
    onDrag([data.x, data.y])
  }, [onDrag])

  return (
    <Draggable
      bounds={ bounds }
      defaultPosition={ defaultPos }
      onStop={ handleDragPickle }
    >
      <Pickle
        size={ 40 }
        color={ color.hex }
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
    />
  )
}
