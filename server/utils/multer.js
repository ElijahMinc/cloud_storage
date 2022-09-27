const multer = require("multer")
const path = require("path")
const uuidV4 = require("uuid").v4

// Multer config
module.exports = multer({
  storage: multer.diskStorage({
    filename: function (_, file, cb) {
      const uniqueSuffix = uuidV4()
      console.log("file", file)
      const filename = Buffer.from(
        file.originalname.split(".")[0],
        "latin1"
      ).toString("utf8")

      // file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')

      cb(null, filename.toString("utf8"))
    },
  }),
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"))
      return
    }

    cb(null, true)
  },
})
