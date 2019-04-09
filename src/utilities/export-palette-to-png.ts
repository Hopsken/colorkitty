import { mostReadable } from '@ctrl/tinycolor'
import { saveAs } from 'file-saver'
import { RGBColor } from 'react-color'

import { toHex } from './color'

const logo = require('@/views/assets/colorkitty.png')

function drawRect(ctx: CanvasRenderingContext2D, color: string, pos: any) {
  ctx.fillStyle = color
  ctx.fillRect(
      pos.x,
      pos.y,
      pos.w,
      pos.h
  )
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

function drawColor(ctx: CanvasRenderingContext2D, color: string, index: number, length: number) {
  const w = 480 / length, h = 300
  drawRect(ctx, color, {
      x: 75 + w * index,
      y: 75,
      w,
      h
  })

  const textColor = mostReadable(color,
      ['#fff', '#4A4A4A'],
      {
        includeFallbackColors: true
      }
    )!.toHexString()

  drawText(
      ctx,
      color,
      textColor,
      {
          x: 90 + w * index,
          y: 224
      }
  )
}

function init(ctx: CanvasRenderingContext2D, name: string) {
  // bg
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, 630, 540)

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
          y: 426
      },
      "500 20px 'Avenir Next'"
  )
}

export function exportPNG(colors: RGBColor[], name: string) {

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const ratio = window.devicePixelRatio || 1

  canvas.width = 1260
  canvas.height = 1080
  ctx.scale(ratio, ratio)
  init(ctx, name)

  colors.map((color, index, all) => drawColor(ctx, toHex(color), index, all.length))

  const avatar = new Image(52, 52)
  avatar.crossOrigin = ''
  avatar.onload = function() {
    ctx.drawImage(<any>this, 390, 407, 122, 30)

    canvas.toBlob((blob) => saveAs(blob!, `${name}.png`))
  }
  avatar.src = logo
}
