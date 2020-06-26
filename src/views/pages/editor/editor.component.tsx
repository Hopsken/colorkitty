import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import _ from 'underscore'
import { message } from 'antd'

import { Header } from './components/header'
import { PaletteList } from './components/palette-list'
import { ColorList } from './components/color-list'
import { ColorCard } from './components/color-card'
import { ColorInfo } from './components/color-info'
import { Painter } from './components/painter'
import { getImageDataFromFile, getColorsFromImage, toHex } from '@/utilities'
// import { Layout } from 'antd'

// import styles from './editor.component.styl'


function useEditor() {
  const [palettes, setPalettes] = useState<PaletteSchema[]>([])
  const [selectedPlt, setSelectedPlt] = useState<string>()
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0)

  const createPalette = useCallback((palette: Partial<PaletteSchema>) =>{
    const newID = _.uniqueId()
    const colors = palette.colors ?? []
    setPalettes((items) => [
      ...items,
      {
        id: newID,
        colors,
        name: palette.name ?? `Palette ${items.length}`,
      }
    ])
    setSelectedPlt(newID)
    setSelectedColorIndex(0)
  }, [])

  const handleUpdatePalette = useCallback((palette: Partial<PaletteSchema>) => {
    setPalettes((items) => {
      return _.map(items, item => {
        if (item.id === selectedPlt) {
          return { ...item, ...palette }
        }
        return item
      })
    })
  }, [selectedPlt])

  const currentPalette = useMemo(() => {
    return _.find(palettes, one => one.id === selectedPlt)
  }, [palettes, selectedPlt])

  const handleUpdateColor = useCallback((color: Partial<ColorSchema>) => {
    if (!currentPalette) { return }

    const rawColors = currentPalette.colors

    handleUpdatePalette({
      ...currentPalette,
      colors: _.map(rawColors, (item, index) => {
        if (index === selectedColorIndex) {
          return { ...item, ...color }
        }
        return item
      })
    })
  }, [handleUpdatePalette, currentPalette, selectedColorIndex])

  const handlers = useMemo(() => {
    return {
      onSelectPalette(id: string) {
        setSelectedPlt(id)
      },
      onSelectColor(index: number) {
        setSelectedColorIndex(index)
      },
    }
  }, [])

  return {
    palettes,
    createPalette,
    currentPalette,
    currentColor: currentPalette?.colors[selectedColorIndex],
    selectedColorIndex,
    onSelectPalette: handlers.onSelectPalette,
    onSelectColor: handlers.onSelectColor,
    handleUpdatePalette,
    handleUpdateColor,
  }
}

function useImage() {
  const rawFile = useRef<File>()
  const imageColors = useRef<RGBColor[]>([])

  interface State {
    imageData: ImageData
    imageSize: FrameSize
  }

  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<State>()

  useEffect(() => {
    if (!state) {
      return
    }

    imageColors.current = getColorsFromImage(state.imageData)
  }, [state])

  const loadImage = useCallback((file: File) => {
    rawFile.current = file
    setLoading(true)

    getImageDataFromFile(file)
      .then((result) => {
        setState(result)
        setLoading(false)
      })
      .catch(() => {
        message.error('error on parsing file')
      })
  }, [])

  const getColorAtPos = useCallback((pos: ColorSchema['pos']) => {
    const { imageSize } = state ?? {}
    if (!imageSize) { return }

    const coordinate = {
      width: Math.round(pos[0] / 100 * imageSize.width),
      height: Math.round(pos[1] / 100 * imageSize.height),
    }
    const index = Math.round(coordinate.height * imageSize.width + coordinate.width)

    return imageColors.current[index]
  }, [state])

  const genRandomColors = useCallback((count = 5): ColorSchema[] => {
    if (!state) { return [] }

    const poses = _.map(new Array(count), () => [_.random(0, 100), _.random(0, 100)])

    return _.map(poses, (pos) => {
      const color = getColorAtPos(pos as [number, number])
      if (!color) { return }

      return { hex: toHex(color) as string, pos }
    }).filter(Boolean) as ColorSchema[]
  }, [getColorAtPos, state])


  return {
    loading,
    imageData: state?.imageData,
    imageSize: state?.imageSize,
    loadImage,
    getColorAtPos,
    genRandomColors,
  }
}

export const Editor = () => {
  const {
    palettes, currentPalette, currentColor, selectedColorIndex,
    createPalette, onSelectPalette, onSelectColor,
    handleUpdateColor, handleUpdatePalette,
  } = useEditor()

  const {
    loading, imageData, imageSize,
    loadImage, getColorAtPos, genRandomColors,
  } = useImage()

  const handleUpdateColorPos = useCallback((pos: NonNullable<ColorSchema['pos']>) => {
    const colorAtPos = getColorAtPos(pos)

    if (!colorAtPos) { return }

    handleUpdateColor({
      hex: toHex(colorAtPos),
      pos,
    })
  }, [handleUpdateColor, getColorAtPos])

  const handleCreatePalette = useCallback(() => {
    const randomColors = genRandomColors()
    createPalette({ colors: randomColors })
  }, [createPalette, genRandomColors])

  // when image change
  useEffect(() => {
    if (!imageData) {
      return
    }

    if (currentPalette) {
      const newColors = currentPalette.colors.map((color) => {
        if (!color.pos) {
          return color
        }

        const newColor = getColorAtPos(color.pos)
        if (!newColor) { return color }

        return { ...color, hex: toHex(newColor) as string }
      })
      handleUpdatePalette({
        ...currentPalette,
        colors: newColors,
      })
    } else {
      handleCreatePalette()
    }
  }, [imageData])

  return (
    <section>
      <Header name="Untitled" onChangeName={() => void 0} />
      <section
        className="fixed inset-0 flex bg-gray-100"
        style={{ top: '4rem' }}
      >
        <aside className="flex-grow-0 w-1/5 bg-white">
          <PaletteList
            selected={ currentPalette?.id }
            palettes={ palettes }
            onClickAdd={ imageData && handleCreatePalette }
            onSelect={ onSelectPalette }
          />
          <ColorList
            activeIndex={ selectedColorIndex }
            colors={ currentPalette?.colors ?? [] }
            onSelect={ onSelectColor }
          />
        </aside>
        <main className="flex items-center justify-center flex-1 flex-grow-1">
          <Painter
            loading={ loading }
            imageData={ imageData }
            imageSize={ imageSize }
            onSelectFile={ loadImage }
            currentColor={ currentColor }
            onUpdateColorPos={ handleUpdateColorPos }
            getColorAtPos={ getColorAtPos }
          />
        </main>
        <aside className="flex-grow-0 w-1/5 bg-white">
          <ColorCard color={ currentColor } />
          <ColorInfo color={ currentColor } />
        </aside>
      </section>
    </section>
  )
}
