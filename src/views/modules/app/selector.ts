import { RootState } from '@/types'

export function selectPalette(state: RootState, paletteId: string) {
  const palette = state.app.palettes.filter(one => one._id === paletteId)

  if (palette && palette.length === 1) {
    return palette
  }

  return null
}
