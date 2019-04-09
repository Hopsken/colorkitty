import { Color, HSLColor, RGBColor } from 'react-color'
import { TinyColor, mostReadable } from '@ctrl/tinycolor'

export function readable(color: Color): string {
  return mostReadable(color,
    ['#fff', '#4A4A4A'],
  )!.toHexString()
}

export function toHex(color: Color): string {
  return (new TinyColor(color)).toHexString()
}

export function toRGBString(color: Color): string {
  return (new TinyColor(color)).toRgbString()
}

export function isHexColor(hex: string) {
  const lh = (String(hex).charAt(0) === '#') ? 1 : 0
  return hex.length !== (4 + lh) && hex.length < (7 + lh) && (new TinyColor(hex)).isValid
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
  const tinycolor = new TinyColor(color)

  return tinycolor.analogous(4).slice(1).map(c => c.toHexString())
}

function monochromatic(color: Color): string[] {
  const tinycolor = new TinyColor(color)
  const result = tinycolor.monochromatic(7).slice(1)
  result.sort((a, b) => b.toHsl().l - a.toHsl().l)

  return result.map(c => c.toHexString())
}

function splitcomplement(color: Color): string[] {
  const tinycolor = new TinyColor(color)

  return tinycolor.splitcomplement().map(c => c.toHexString())
}

function triad(color: Color): string[] {
  const tinycolor = new TinyColor(color)

  return tinycolor.triad().map(c => c.toHexString())
}

function tetrad(color: Color): string[] {
  const tinycolor = new TinyColor(color)

  return tinycolor.tetrad().map(c => c.toHexString())
}

function complement(color: Color): string[] {
  const tinycolor = new TinyColor(color)

  return [toHex(color), tinycolor.complement().toHexString()]
}

function shades(color: Color): string[] {
  const tinycolor = new TinyColor(color)

  return [
    tinycolor.tint(90).toHexString(),
    tinycolor.tint(60).toHexString(),
    tinycolor.tint(30).toHexString(),
    tinycolor.toHexString(),
    tinycolor.shade(30).toHexString(),
    tinycolor.shade(60).toHexString(),
    tinycolor.shade(90).toHexString(),
  ]
}

export const colorCombinations = {
  analogous,
  monochromatic,
  splitcomplement,
  triad,
  tetrad,
  complement,
  shades,
}

export type ColorCombinationType = 'analogous' | 'monochromatic' | 'splitcomplement' |
  'triad' | 'tetrad' | 'complement' | 'shades'
