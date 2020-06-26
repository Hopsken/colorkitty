import { HSLColor, RGBColor, Color } from 'react-color'
import { TinyColor, mostReadable } from '@ctrl/tinycolor'
import { HexColor } from '@/types'

export function readable(color: Color): string {
  return mostReadable(color, ['#fff', '#4A4A4A'])!.toHexString()
}

export function toHex(color: Color): HexColor {
  return new TinyColor(color).toHexString().toUpperCase() as HexColor
}

export function toRGBString(color: Color): string {
  return new TinyColor(color).toRgbString()
}

export function isHexColor(hex: Color) {
  return typeof hex === 'string' && new TinyColor(hex).isValid
}

export function isRGBColor(color: Color): color is RGBColor {
  return typeof color !== 'string' && (color as any)?.r !== undefined
}

export function isHSLColor(color: Color): color is HSLColor {
  return typeof color !== 'string' && (color as any)?.h !== undefined
}

export function getRandomColor() {
  return toHex({
    r: Math.floor(Math.random() * 255),
    g: Math.floor(Math.random() * 255),
    b: Math.floor(Math.random() * 255),
    a: 1,
  })
}

function analogous(color: Color) {
  const tinycolor = new TinyColor(color)

  return tinycolor
    .analogous(4)
    .slice(1)
    .map(c => c.toHexString())
}

function monochromatic(color: Color) {
  const tinycolor = new TinyColor(color)
  const result = tinycolor.monochromatic(7).slice(1)
  result.sort((a, b) => b.toHsl().l - a.toHsl().l)

  return result.map(c => c.toHexString())
}

function splitcomplement(color: Color) {
  const tinycolor = new TinyColor(color)

  return tinycolor.splitcomplement().map(c => c.toHexString())
}

function triad(color: Color) {
  const tinycolor = new TinyColor(color)

  return tinycolor.triad().map(c => c.toHexString())
}

function tetrad(color: Color) {
  const tinycolor = new TinyColor(color)

  return tinycolor.tetrad().map(c => c.toHexString())
}

function complement(color: Color) {
  const tinycolor = new TinyColor(color)

  return [toHex(color), tinycolor.complement().toHexString()]
}

function shades(color: Color) {
  const tinycolor = new TinyColor(color)

  return [
    tinycolor.tint(75).toHexString(),
    tinycolor.tint(50).toHexString(),
    tinycolor.tint(25).toHexString(),
    tinycolor.toHexString(),
    tinycolor.shade(25).toHexString(),
    tinycolor.shade(50).toHexString(),
    tinycolor.shade(75).toHexString(),
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

export type ColorCombinationType =
  | 'analogous'
  | 'monochromatic'
  | 'splitcomplement'
  | 'triad'
  | 'tetrad'
  | 'complement'
  | 'shades'
