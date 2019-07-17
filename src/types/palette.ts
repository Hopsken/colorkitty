import { RGBColor } from 'react-color'

type Id<T> = string & { kind: T }

export interface Palette {
  palette_id: Id<'palettedId'>
  uid: Id<'userId'>
  colors: RGBColor[]
  name: string
  likes: number
  created: string
  liked: boolean
}
