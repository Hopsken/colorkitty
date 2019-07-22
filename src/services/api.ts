import { RGBColor } from 'react-color'

import { baseUrl } from '@/config'
import { toHex, request, urlQuery } from '@/utilities'
import { Palette } from '@/types'

export interface SavePalettePayload {
  colors: RGBColor[]
  name: string
}

export interface GetPalettesParams {
  timeframe?: 'week' | 'month' | 'year' | 'all'
  sorts?: 'likes' | 'newest'
}

export const savePalette = (
  payload: SavePalettePayload
): Promise<Palette> => {
  const { colors, name } = payload
  const body = {
    name,
    colors: colors.map(one => toHex(one)).join(' '),
  }
  return request.post(`${baseUrl}/user/palettes`, JSON.stringify(body))
}

export const userPalettes = (): Promise<Palette[]> => {
  return request.get(`${baseUrl}/user/palettes`)
}

export const userLikes = (): Promise<Palette[]> => {
  return request.get(`${baseUrl}/user/likes`)
}

export const getPalettes = (params: GetPalettesParams = {
  timeframe: 'week',
  sorts: 'likes'
}): Promise<Palette[]> => {
  return request.get(urlQuery.append(`${baseUrl}/palettes`, params))
}

export const likePalette = (palette_id: number) => {
  return request.post(`${baseUrl}/user/like`, JSON.stringify({ palette_id }))
}

export const unlikePalette = (palette_id: number) => {
  return request.delete(`${baseUrl}/user/like`, JSON.stringify({ palette_id }))
}

export const getPalette = (palette_id: string) => {
  return request.get(`${baseUrl}/palette/${palette_id}`)
}
