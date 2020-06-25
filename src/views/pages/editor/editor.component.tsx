import React, { useState, useCallback, useMemo } from 'react'
import _ from 'underscore'

import { Header } from './components/header'
import { PaletteList } from './components/palette-list'
import { ColorList } from './components/color-list'
import { ColorCard } from './components/color-card'
import { ColorInfo } from './components/color-info'
// import { Layout } from 'antd'

// import styles from './editor.component.styl'


function useEditor() {
  const [palettes, setPalettes] = useState<PaletteSchema[]>([])
  const [imageData, setImageData] = useState<ImageData>()
  const [selectedPlt, setSelectedPlt] = useState<string>()
  const [selectedColor, setSelectedColor] = useState<ColorSchema>()

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
    setSelectedColor(colors[0])
  }, [])

  const loadImageData = useCallback(() => {
    setImageData(undefined)
  }, [])

  const currentPalette = useMemo(() => {
    return _.find(palettes, one => one.id === selectedPlt)
  }, [palettes, selectedPlt])

  const handlers = useMemo(() => {
    return {
      onSelectPalette(id: string) {
        setSelectedPlt(id)
      },
      onSelectColor(color: ColorSchema) {
        setSelectedColor(color)
      }
    }
  }, [])

  return {
    palettes,
    createPalette,
    imageData,
    loadImageData,
    currentPalette,
    currentColor: selectedColor,
    onSelectPalette: handlers.onSelectPalette,
    onSelectColor: handlers.onSelectColor,
  }
}

export const Editor = () => {
  const {
    palettes, currentPalette, currentColor,
    createPalette, onSelectPalette, onSelectColor,
  } = useEditor()

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
            colors={ currentPalette?.colors ?? [] }
            onSelect={ onSelectColor }
          />
        </aside>
        <main className="flex-1 flex-grow-1">CORE</main>
        <aside className="flex-grow-0 w-1/5 bg-white">
          <ColorCard color={ currentColor } />
          <ColorInfo color={ currentColor } />
        </aside>
      </section>
    </section>
  )
}
