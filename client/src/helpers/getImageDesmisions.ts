interface DesmisionImage {
  width: number
  height: number
}
export const getImageDimensions = (
  base64OfFile: string
): Promise<DesmisionImage> => {
  return new Promise(function (resolved, rejected) {
    const i = new Image()
    i.onload = function () {
      resolved({ width: i.width, height: i.height })
    }
    i.src = base64OfFile
  })
}
