const { Router } = require("express")
const fileController = require("../controllers/fileController.js")

const authMiddleware = require("../middlewares/auth.middleware.js")
const multer = require("../utils/multer")
const file = Router()

file.get("/", authMiddleware, multer.none(), fileController.fetchFiles)
file.post("/", authMiddleware, multer.none(), fileController.createDir)
// file.get('/download/:id', authMiddleware, fileController.downloadFile);
file.delete("/:id", authMiddleware, fileController.deleteFile)

file.post(
  "/upload",
  authMiddleware,
  multer.single("file"),
  fileController.uploadFile.bind(fileController)
)
file.post("/avatar/upload", authMiddleware, fileController.uploadAvatar)
file.delete("/avatar/delete", authMiddleware, fileController.deleteAvatar)

module.exports = file
