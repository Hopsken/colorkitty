import { Color } from 'react-color'

import { baseUrl } from '@/config'
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
  return request.post(`${baseUrl}/palettes`, JSON.stringify(body))
}

export const userPalettes = (): Promise<Palette[]> => {
  return request.get(`${baseUrl}/users/me/palettes`)
}

export const userLikes = (): Promise<Palette[]> => {
  return request.get(`${baseUrl}/users/me/palettes/likes`)
}

export const getPalettes = ({
  timeframe = 'week',
  sortBy = 'likes',
}: GetPalettesParams): Promise<Palette[]> => {
  return request.get(
    urlQuery.append(`${baseUrl}/palettes`, { timeframe, sortBy }),
  )
}

export const likePalette = (palette_id: number) => {
  return request.post(`${baseUrl}/palettes/${palette_id}/like`)
}

export const unlikePalette = (palette_id: number) => {
  return request.delete(`${baseUrl}/palettes/${palette_id}/like`)
}

export const getPalette = (palette_id: string) => {
  return request.get(`${baseUrl}/palettes/${palette_id}`)
}

export const deletePalette = (palette_id: number) => {
  return request.delete(`${baseUrl}/palettes/${palette_id}`)
}
