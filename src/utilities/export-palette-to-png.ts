import { saveAs } from 'file-saver'
import { RGBColor } from 'react-color'

import { toHex, readable, colorCombinations } from './color'

const logo = require('@/views/assets/colorkitty.png')

function drawRect(ctx: CanvasRenderingContext2D, color: string, pos: any) {
  ctx.fillStyle = color
  ctx.fillRect(pos.x, pos.y, pos.w, pos.h)
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  color = '#000',
  pos: any,
  font = "16px 'Avenir Next'",
) {
  ctx.font = font
  ctx.fillStyle = color
  ctx.fillText(text, pos.x, pos.y)
}

function drawColor(
  ctx: CanvasRenderingContext2D,
  color: string,
  index: number,
  length: number,
) {
  const w = 480 / length
  const h = 300
  drawRect(ctx, color, {
    x: 75 + w * index,
    y: 75,
    w,
    h,
  })

  drawText(ctx, color, readable(color), {
    x: 90 + w * index,
    y: 224,
  })
}

function drawShades(
  ctx: CanvasRenderingContext2D,
  color: string,
  index: number,
) {
  const w = 55
  const h = 30
  const shades = colorCombinations.shades(color)

  shades.map((shade, idx) =>
    drawRect(ctx, shade, {
      x: 75 + (w + 15) * idx,
      y: 505 + 50 * index,
      w,
      h,
    }),
  )
}

function init(
  ctx: CanvasRenderingContext2D,
  name: string,
  canvas: HTMLCanvasElement,
) {
  // bg
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // shadow
  ctx.rect(75, 75, 480, 390)
  ctx.fillStyle = '#fff'
  ctx.shadowColor = 'rgba(62,57,107,0.2)'
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 10
  ctx.shadowBlur = 40
  ctx.fill()

  ctx.rect(75, 75, 480, 390)
  ctx.fillStyle = '#fff'
  ctx.shadowColor = 'rgba(62,57,107,0.2)'
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 2
  ctx.shadowBlur = 9
  ctx.fill()

  ctx.shadowColor = ''
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur = 0

  drawText(
    ctx,
    name,
    '#565656',
    {
      x: 107,
      y: 426,
    },
    "500 20px 'Avenir Next'",
  )
}

export function exportPNG(
  colors: RGBColor[],
  name: string,
  includeShades = false,
) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const ratio = window.devicePixelRatio || 1

  canvas.width = 1260
  canvas.height = includeShades
    ? 1080 + 40 * 2 + colors.length * (30 + 20)
    : 1080
  ctx.scale(ratio, ratio)
  init(ctx, name, canvas)

  colors.map((color, index, all) =>
    drawColor(ctx, toHex(color), index, all.length),
  )
  if (includeShades) {
    colors.map((color, index) => drawShades(ctx, toHex(color), index))
  }

  const avatar = new Image(52, 52)
  avatar.crossOrigin = ''
  avatar.onload = function() {
    ctx.drawImage(this as any, 390, 407, 122, 30)

    canvas.toBlob(blob => saveAs(blob!, `${name}.png`))
  }
  avatar.src = logo
}
