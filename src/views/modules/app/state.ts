import { Palette } from '@/types'

export interface AppStore {
  current: Palette | null
  palettes: Palette[]
  userPaletteIds: Array<Palette['_id']>
  likedPaletteIds: Array<Palette['_id']>
  popularPaletteIds: Array<Palette['_id']>
  newestPaletteIds: Array<Palette['_id']>
}

declare module '@/types' {
  interface RootState {
    app: AppStore
  }
}
