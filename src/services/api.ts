import { Color } from 'react-color'

import { apiHost } from '@/config'
import { toHex, request, urlQuery } from '@/utilities'
import { Palette } from '@/types'

export interface SavePalettePayload {
  colors: Color[]
  name: string
}

export interface GetPalettesParams {
  timeframe?: 'week' | 'month' | 'year' | 'all'
  sortBy?: 'likes' | 'created'
}

export const savePalette = (payload: SavePalettePayload): Promise<Palette> => {
  const { colors, name } = payload
  const body = {
    name,
    colors: colors.map(one => toHex(one)),
  }
  return request.post(`${apiHost}/palettes`, JSON.stringify(body))
}

export const userPalettes = (): Promise<Palette[]> => {
  return request.get(`${apiHost}/users/me/palettes`)
}

export const userLikes = (): Promise<Palette[]> => {
  return request.get(`${apiHost}/users/me/palettes/likes`)
}

export const getPalettes = ({
  timeframe = 'week',
  sortBy = 'likes',
}: GetPalettesParams): Promise<Palette[]> => {
  return request.get(
    urlQuery.append(`${apiHost}/palettes`, { timeframe, sortBy }),
  )
}

export const likePalette = (paletteId: number) => {
  return request.post(`${apiHost}/palettes/${paletteId}/like`)
}

export const unlikePalette = (paletteId: number) => {
  return request.delete(`${apiHost}/palettes/${paletteId}/like`)
}

export const getPalette = (paletteId: string) => {
  return request.get(`${apiHost}/palettes/${paletteId}`)
}

export const deletePalette = (paletteId: number) => {
  return request.delete(`${apiHost}/palettes/${paletteId}`)
}
