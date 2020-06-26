export function getCanvasSize(rawWidth: number, rawHeight: number): FrameSize {
  const viewportWidth = Math.max(
    document.documentElement.getBoundingClientRect().width,
    window.innerWidth || 0,
  )
  const canvasWidth = viewportWidth < 768 ? 300 : 560

  return {
    width: canvasWidth,
    height: Math.floor(canvasWidth * (rawHeight / rawWidth)),
  }
}
