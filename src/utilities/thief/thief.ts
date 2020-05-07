/*
  from: https://github.com/lokesh/color-thief/blob/master/src/color-thief.js
*/

import { RGBColor } from 'react-color'
import { MMCQ } from './mmcq'

export const getPaletteFromImage = (
  imageData: ImageData,
  colorCount?: number,
  quality?: number,
): RGBColor[] | null => {
  if (!imageData) {
    return null
  }

  if (!colorCount || colorCount < 4 || colorCount > 6) {
    colorCount = 5
  }

  if (!quality || quality < 1) {
    quality = 10
  }

  const pixelArray = getPixelsFromImage(imageData, {
    quality: 10,
    excludeWhite: true,
  })

  const cmap = MMCQ.quantize(pixelArray, colorCount)
  let palette = cmap ? cmap.palette() : null

  if (palette) {
    palette = palette.map((arr: number[]) => ({
      r: arr[0],
      g: arr[1],
      b: arr[2],
    }))
  }

  return palette
}

export const getPixelsFromImage = (
  imageData: ImageData,
  options: {
    quality?: number
    excludeWhite?: boolean
  },
) => {
  if (!imageData || !imageData.data) {
    return []
  }

  const quality = options.quality || 5
  const excludeWhite = options.excludeWhite || false

  const pixels = imageData.data
  const pixelCount = imageData.height * imageData.width

  const pixelArray: number[][] = []

  for (let i = 0, offset, r, g, b, a; i < pixelCount; i += quality) {
    offset = i * 4
    r = pixels[offset + 0]
    g = pixels[offset + 1]
    b = pixels[offset + 2]
    a = pixels[offset + 3]

    // if pixel is mostly opaque and not white
    if (excludeWhite && a >= 125) {
      if (r > 250 && g > 250 && b > 250) {
        continue
      }
    }
    pixelArray.push([r, g, b, a / 255])
  }

  return pixelArray
}

export const getColorsFromImage = (imageData: ImageData) => {
  return getPixelsFromImage(imageData, { quality: 1, excludeWhite: false }).map(
    arr => ({ r: arr[0], g: arr[1], b: arr[2] } as RGBColor),
  )
}

/* 颜色相似度
  from: https://www.compuphase.com/cmetric.htm

*/
const colorDistance = (c1: RGBColor, c2: RGBColor) => {
  const rMean = (c1.r - c2.r) / 2
  const r = c1.r - c2.r
  const g = c1.g - c2.g
  const b = c1.b - c2.b

  return Math.sqrt(
    // tslint:disable-next-line
    (((512 + rMean) * r * r) >> 8) + 4 * g * g + (((767 - rMean) * b * b) >> 8),
  )
}

const findNearestColor = (colors: RGBColor[], target: RGBColor) => {
  let nearestIndex = 0

  let minDistance = Infinity
  let distance = 0

  for (let i = 0; i < colors.length; i++) {
    distance = colorDistance(colors[i], target)

    if (distance === 0) {
      nearestIndex = i
      break
    }

    if (distance < minDistance) {
      nearestIndex = i
      minDistance = distance
    }
  }

  return {
    index: nearestIndex,
    rgb: colors[nearestIndex],
    distance: minDistance,
  }
}

export const findNearestColorOfPalette = (
  colors: RGBColor[],
  palette: RGBColor[],
) => {
  return palette.map(one => findNearestColor(colors, one))
}
