import { getCanvasSize } from './canvas'

export function getFileDataUrl(img: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (reader.result) {
        resolve(reader.result as string)
      } else {
        reject(reader.error)
      }
    })
    reader.readAsDataURL(img)
  })
}

export function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()

    img.crossOrigin = ''
    img.onload = () => resolve(img)
    img.src = url
    img.onerror = (error: any) => reject(error)
  })
}

export async function getImageDataFromFile(file: File, frame?: FrameSize) {
  const dataUrl = await getFileDataUrl(file)
  const imgEl = await loadImage(dataUrl)

  const frameSize = frame ?? getCanvasSize(imgEl.width, imgEl.height)

  const canvas = document.createElement('canvas')
  canvas.width = frameSize.width ?? imgEl.width
  canvas.height = frameSize.height ?? imgEl.height

  const ctx = canvas.getContext('2d')
  if (!ctx) { throw Error('invalid canvas context') }

  ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height)

  return {
    imageData: ctx.getImageData(0, 0, canvas.width, canvas.width),
    imageSize: { width: canvas.width, height: canvas.height }
  }
}
