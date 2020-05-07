export function getImageDataUrlAsync(img: File): Promise<string> {
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
