import React, { useState, useCallback, useMemo } from 'react'
import _ from 'underscore'

import { Header } from './components/header'
import { PaletteList } from './components/palette-list'
import { ColorList } from './components/color-list'
// import { Layout } from 'antd'

// import styles from './editor.component.styl'


function useEditor() {
  const [palettes, setPalettes] = useState<PaletteSchema[]>([])
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [selectedPlt, setSelectedPlt] = useState<string | undefined>()

  const createPalette = useCallback(() =>{
    const newID = _.uniqueId()
    setPalettes((items) => [
      ...items,
      {
        id: newID,
        name: `Palette ${items.length}`,
        colors: [{ hex: '#A6A6A6' }],
      }
    ])
    setSelectedPlt(newID)
  }, [])

  const loadImageData = useCallback(() => {
    setImageData(null)
  }, [])

  const currentPalette = useMemo(() => {
    return _.find(palettes, one => one.id === selectedPlt)
  }, [palettes, selectedPlt])

  const handlers = useMemo(() => {
    return {
      onSelectPalette(id: string) {
        setSelectedPlt(id)
      }
    }
  }, [])

  return {
    palettes,
    createPalette,
    imageData,
    loadImageData,
    currentPalette,
    onSelectPalette: handlers.onSelectPalette,
  }
}

export const Editor = () => {
  const { palettes, currentPalette, createPalette, onSelectPalette } = useEditor()

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
            onSelect={ console.info }
          />
        </aside>
        <main className="flex-1 flex-grow-1">CORE</main>
        <aside className="flex-grow-0 w-1/5 bg-white">RIGHT</aside>
      </section>
    </section>
  )
}
