import axios from "axios"

export const downloadImage = async (
  url,
  options = {
    name: "",
    format: "",
  }
) => {
  const { name, format } = options
  const { data: imageBlob } = await axios(url, {
    responseType: "blob",
  })

  const imageURL = URL.createObjectURL(imageBlob)

  const link = document.createElement("a")
  link.href = imageURL
  link.download = name + `.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(imageURL)
}
