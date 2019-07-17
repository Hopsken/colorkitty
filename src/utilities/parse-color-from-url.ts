import { TinyColor } from '@ctrl/tinycolor'
import { RGBColor } from 'react-color'

export function parseColorsFromUrl(url: string) {
  if (!url) {
    return null
  }
  let isValid = true
  const hexColors = url.split('-')
  const rgbColors = hexColors.map(one => {
    const color = new TinyColor(one)
    if (!color.isValid) {
      isValid = false
    }
    return color.toRgb() as RGBColor
  })

  return isValid ? rgbColors : null
}
