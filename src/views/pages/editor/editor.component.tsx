import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import _ from 'underscore'
import { message, Button } from 'antd'

import { Header } from './components/header'
import { PaletteList } from './components/palette-list'
import { ColorList } from './components/color-list'
import { ColorCard } from './components/color-card'
import { ColorInfo } from './components/color-info'
import { Painter } from './components/painter'
import { getImageDataFromFile, getColorsFromImage, toHex } from '@/utilities'
import { ColorPanels } from '@/views/components'
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
        name: palette.name ?? `Palette ${items.length + 1}`,
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
      reset() {
        setPalettes([])
        setSelectedPlt(undefined)
        setSelectedColorIndex(0)
      }
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
    handleUpdatePalettes: setPalettes,
    handleUpdateColor,
    reset: handlers.reset,
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
      imageColors.current = []
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

  const reset = useCallback(()=> {
    setState(undefined)
    setLoading(false)
    imageColors.current = []
    rawFile.current = undefined
  }, [])


  return {
    loading,
    imageData: state?.imageData,
    imageSize: state?.imageSize,
    loadImage,
    getColorAtPos,
    genRandomColors,
    reset,
  }
}

export const Editor = () => {
  const {
    palettes, currentPalette, currentColor, selectedColorIndex,
    createPalette, onSelectPalette, onSelectColor,
    handleUpdateColor, handleUpdatePalette, reset: resetEditor, handleUpdatePalettes,
  } = useEditor()

  const {
    loading, imageData, imageSize,
    loadImage, getColorAtPos, genRandomColors, reset: resetImage
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

  const colorHandlers = useMemo(() => {
    return {
      handleAddColor() {
        const randomColor = genRandomColors(1)
        handleUpdatePalette({
          colors: (currentPalette?.colors ?? []).concat(randomColor)
        })
      },
      handleDeleteColor(index: number) {
        handleUpdatePalette({
          colors: (currentPalette?.colors ?? []).filter((__, cur: number) => cur !== index)
        })
      },
    }
  }, [handleUpdatePalette, currentPalette])

  const paletteHandlers = useMemo(() => {
    return{
      delete(id: string) {
        return handleUpdatePalettes(items => items.filter(one => one.id !== id))
      },
      rename(id: string, name: string) {
        return handleUpdatePalettes(items => _.map(items, (item) => {
          if (item.id === id) {
            return { ...item, name }
          }
          return item
        }))
      }
    }
  }, [handleUpdatePalettes])

  const handleResetAll = useCallback(() => {
    resetEditor()
    resetImage()
  }, [resetImage, resetEditor])

  const handleDeleteColor = useCallback(() => {
    colorHandlers.handleDeleteColor(selectedColorIndex)
  }, [colorHandlers.handleDeleteColor, selectedColorIndex])

  const deleteButton = currentColor && (
    <div className='mx-4 my-4'>
      <Button block={ true } type='default' onClick={ handleDeleteColor }>
        Delete Swatch
      </Button>
    </div>
  )

  return (
    <section>
      <Header name="Untitled" onChangeName={() => void 0} onSave={ console.info } onReset={ handleResetAll } />
      <section
        className="fixed inset-0 flex bg-gray-100"
        style={{ top: '4rem' }}
      >
        <aside className="flex-grow-0 w-1/5 max-w-xs bg-white">
          <PaletteList
            selected={ currentPalette?.id }
            palettes={ palettes }
            onClickAdd={ imageData && handleCreatePalette }
            onSelect={ onSelectPalette }
            onDelete={ paletteHandlers.delete }
            onRename={ paletteHandlers.rename }
          />
          <ColorList
            activeIndex={ selectedColorIndex }
            colors={ currentPalette?.colors ?? [] }
            onSelect={ onSelectColor }
            onAddColor={ imageData && colorHandlers.handleAddColor }
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
        <aside className="flex-grow-0 w-1/5 max-w-xs overflow-y-auto bg-white">
          <ColorCard color={ currentColor } />
          <ColorInfo color={ currentColor } />
          { currentColor && <ColorPanels hex={ currentColor.hex } /> }
          { deleteButton }
        </aside>
      </section>
    </section>
  )
}
