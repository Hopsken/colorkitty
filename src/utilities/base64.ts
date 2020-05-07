export function getBase64(
  img: File,
  callback: (result: string | ArrayBuffer | null) => any,
) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
