export function getImageDataUrlAsync(img: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (reader.result) {
        resolve(<string>reader.result)
      } else {
        reject(reader.error)
      }
    })
    reader.readAsDataURL(img)
  })
}
