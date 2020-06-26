declare interface PixelsJS {
  filterImgData(data: ImageData, filter: string): ImageData
}

declare const pixelsJS: PixelsJS


declare module '*.styl' {
  const content: {[className: string]: string};
  export default content;
}

declare interface ColorSchema {
  hex: string
  name?: string
  pos?: [number, number]
}

declare interface PaletteSchema {
  id: string
  name: string
  colors: ColorSchema[]
}

declare interface RGBColor {
  r: number
  g: number
  b: number
  a?: number
}

declare interface FrameSize {
  width: number
  height: number
}
