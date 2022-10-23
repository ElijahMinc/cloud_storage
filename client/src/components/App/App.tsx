import { BrowserRouter as Router } from "react-router-dom"
import { Header } from "@components/Header/Header"
import { Toast } from "@common/Toast/Toast"
import { AppRouter } from "@components/AppRouter/AppRouter"
import { useEffect } from "react"
import { LANGUAGES, LocalStorageKeys } from "@/constant"

export const App = () => {
  // const { i18n } = useTranslate()

  useEffect(() => {
    if (!localStorage.getItem(LocalStorageKeys.LANGUAGE)) {
      localStorage.setItem(LocalStorageKeys.LANGUAGE, LANGUAGES.EN)
    }
  }, [])

  return (
    <div className="App">
      {/* <input
        type="file"
        onChange={async (e: any) => {
          const file = e.target.files[0]
          const form = new FormData()

          form.append("file", file)

          const { data } = (await axios.post(
            "http://localhost:5000/file/transform",
            form,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )) as any

          // const b64ToBlob = await fetch(data.image)
          //   .then((data) => data.blob())
          //   .then((blobImage) => blobImage)
          // console.log("b64ToBlob", b64ToBlob)
          const image = document.createElement("img")
          image.src = `data:image/${data.imageInfo.format};base64,` + data.image

          // console.log("e", e)

          document.querySelector("body")?.append(image)
          // const reader = new FileReader()

          // reader.onload = (e) => {
          //   const result = (e.target as any).result as any

          // }

          // reader.readAsDataURL(new Blob([data.image]))
        }}
      /> */}
      <Router>
        <Header />
        <main>
          <div className="container">
            <AppRouter />
          </div>
        </main>
      </Router>
      <Toast />
    </div>
  )
}
