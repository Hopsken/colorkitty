import { RootState } from '@/types'

export function selectPalette(state: RootState, palette_id: string) {
  const palette = state.app.palettes.filter(one => one.palette_id === palette_id)

  if (palette && palette.length === 1) {
    return palette
  }

  return null
}
