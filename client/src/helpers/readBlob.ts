export const readBlob = (blob: Blob): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => resolve(reader.result))
    reader.addEventListener("error", reject)
    reader.readAsDataURL(blob)
  })
}
