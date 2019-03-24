import { Color, HSLColor, RGBColor } from 'react-color'
import QixColor from 'color'
import tinyColor from 'tinycolor2'

function removeAlpha(color: Color) {
  if (isRGBColor(color) || isHSLColor(color)) {
    delete color.a
  }
  return color
}

export function toHex(color: Color): string {
  return QixColor(removeAlpha(color)).hex()
}

export function toRGBString(color: Color): string {
  return QixColor(removeAlpha(color)).rgb().string()
}

export function hslToRgb(color: HSLColor): RGBColor {
  const rgbArr = QixColor(removeAlpha(color)).rgb()
  return {
    r: rgbArr[0],
    g: rgbArr[1],
    b: rgbArr[2],
  }
}

export function isHexColor(hex: string) {
  const lh = (String(hex).charAt(0) === '#') ? 1 : 0
  return hex.length !== (4 + lh) && hex.length < (7 + lh) && tinyColor(hex).isValid()
}

export function isRGBColor(color: Color): color is RGBColor {
  return color != null && (color as RGBColor).r !== undefined
}

export function isHSLColor(color: Color): color is HSLColor {
  return color != null && (color as HSLColor).h !== undefined
}

export function getRandomColor(): RGBColor {
  return {
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
    a: 1
  }
}

function analogous(color: Color): string[] {
  const tinycolor = tinyColor(toHex(color))

  return tinycolor.analogous(4).slice(1).map(c => c.toHexString())
}

function monochromatic(color: Color): string[] {
  const tinycolor = tinyColor(toHex(color))
  const result = tinycolor.monochromatic(7).slice(1)
  result.sort((a, b) => b.toHsl().l - a.toHsl().l)

  return result.map(c => c.toHexString())
}

function splitcomplement(color: Color): string[] {
  const tinycolor = tinyColor(toHex(color))

  return tinycolor.splitcomplement().map(c => c.toHexString())
}

function triad(color: Color): string[] {
  const tinycolor = tinyColor(toHex(color))

  return tinycolor.triad().map(c => c.toHexString())
}

function tetrad(color: Color): string[] {
  const tinycolor = tinyColor(toHex(color))

  return tinycolor.tetrad().map(c => c.toHexString())
}

function complement(color: Color): string[] {
  const tinycolor = tinyColor(toHex(color))

  return [toHex(color), tinycolor.complement().toHexString()]
}

export const colorCombinations = {
  analogous,
  monochromatic,
  splitcomplement,
  triad,
  tetrad,
  complement
}

export type ColorCombinationType = 'analogous' | 'monochromatic' | 'splitcomplement' |
  'triad' | 'tetrad' | 'complement'
