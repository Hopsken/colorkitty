import React, { useState, useCallback, useMemo, useRef } from 'react'
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

  const createPalette = useCallback(() =>{
    const newID = _.uniqueId()
    const colors = [{ hex: '#20639B' }]
    setPalettes((items) => [
      ...items,
      {
        id: newID,
        colors,
        name: `Palette ${items.length}`,
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

  const [loading, setLoading] = useState(false)
  const [imageData, setImageData] = useState<ImageData>()
  const [imageSize, setImageSize] = useState<{ width: number, height: number }>()

  const loadImage = useCallback((file: File) => {
    rawFile.current = file
    setLoading(true)

    getImageDataFromFile(file)
      .then((result) => {
        setImageData(result.imageData)
        setImageSize(result.imageSize)
        setLoading(false)

        imageColors.current = getColorsFromImage(result.imageData)
      })
      .catch(() => {
        message.error('error on parsing file')
      })
  }, [])

  const getColorAtPos = useCallback((pos: NonNullable<ColorSchema['pos']>) => {
    if (!imageSize) { return }

    const coordinate = {
      width: Math.round(pos[0] / 100 * imageSize.width),
      height: Math.round(pos[1] / 100 * imageSize.height),
    }
    const index = Math.round(coordinate.height * imageSize.width + coordinate.width)

    return imageColors.current[index]
  }, [imageSize])


  return {
    loading,
    imageData,
    imageSize,
    loadImage,
    getColorAtPos,
  }
}

export const Editor = () => {
  const {
    palettes, currentPalette, currentColor, selectedColorIndex,
    createPalette, onSelectPalette, onSelectColor, handleUpdateColor,
  } = useEditor()

  const {
    loading, imageData, imageSize,
    loadImage, getColorAtPos,
  } = useImage()

  const handleUpdateColorPos = useCallback((pos: NonNullable<ColorSchema['pos']>) => {
    const colorAtPos = getColorAtPos(pos)

    if (!colorAtPos) { return }

    handleUpdateColor({
      hex: toHex(colorAtPos),
      pos,
    })
  }, [handleUpdateColor, getColorAtPos])

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
            onClickAdd={ createPalette }
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
