import { Palette } from '@/types'

export interface AppStore {
  current: Palette | null
  palettes: Palette[]
  userPaletteIds: Array<Palette['palette_id']>
  likedPaletteIds: Array<Palette['palette_id']>
  popularPaletteIds: Array<Palette['palette_id']>
  newestPaletteIds: Array<Palette['palette_id']>
}

declare module '@/types' {
  interface RootState {
    app: AppStore
  }
}
