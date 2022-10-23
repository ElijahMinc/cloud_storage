const path = require("path")
const fs = require("fs")
const uuid = require("uuid")
const File = require("../modules/File.js")
const User = require("../modules/User.js")
const fileService = require("../services/fileService.js")
const cloudinary = require("../utils/cloudinary")
const sharp = require("sharp")
class FileController {
  async createDir(req, res) {
    try {
      const { name, parentId } = req.body
      console.log("name", name)

      if (!name) {
        return res.status(500).json({
          message: "Error with create dir",
        })
      }
      const file = new File({
        name,
        type: "dir",
        date: new Date(),
        user_id: req.userId,
      })

      const parentFile = await File.findOne({ _id: parentId })

      let pathFile = ""

      if (parentFile) {
        pathFile = parentFile.path + path.sep + file.name

        parentFile.childs_dir.push(file._id)

        await fileService.createCloudinaryDir(file, parentFile)

        file.parent_id = parentId

        await parentFile.save()
      } else {
        pathFile = file.name

        await fileService.createCloudinaryDir(file)
      }

      file.path = pathFile

      await file.save()

      return res.status(200).json(file)
    } catch (e) {
      console.log("ERROR", e)
      return res.status(500).json({
        message: "Ошибка создания папки",
      })
    }
  }

  async fetchFiles(req, res) {
    try {
      const { search, filter, sort } = req.query
      const queryParams = {
        parent_id: req.query.id,
        user_id: req.userId,
      }

      if (search) {
        queryParams.$text = { $search: search, $diacriticSensitive: true }
      }

      let files = await File.find(queryParams).sort({ date: sort })

      return res.status(200).json(files)
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        message: "Ошибка в получении файлов",
      })
    }
  }

  async updateSizeParentDir(parentFile, options = { isDelete: false }) {
    if (!parentFile) return

    const parentDirOfParentDir = await File.findOne({
      _id: parentFile?.parent_id,
    })

    if (!parentDirOfParentDir) return

    if (options.isDelete) {
      parentDirOfParentDir.size -= parentFile.size
    } else {
      parentDirOfParentDir.size += parentFile.size
    }
    await parentDirOfParentDir.save()

    this.updateSizeParentDir(parentDirOfParentDir.parent_id)
  }

  async uploadFile(req, res) {
    try {
      const file = req?.file
      console.log("file", file)
      const { parentId } = req.body

      const parentFile = await File.findOne({ _id: parentId })
      const user = await User.findOne({ _id: req.userId })
      const typeFile = file.fieldname

      const newFile = new File({
        name: file.filename,
        type: typeFile,
        user_id: req.userId,
        date: new Date(),
        preview: "",
        uniq_hash: "",
      })

      newFile.size = file.size + user.usedSpace

      let pathnameFile = fileService.getDefaultFilePath(newFile.user_id)

      if (parentFile) {
        const pathParentFile = path.sep + parentFile.path
        pathnameFile += pathParentFile

        newFile.parent_id = parentId

        newFile.path = parentFile.path
        parentFile.size += newFile.size

        if (!!parentFile.parent_id && parentFile.type === "dir") {
          this.updateSizeParentDir(parentFile, { isDelete: false })
        }

        parentFile.childs_dir.push(newFile._id)

        await parentFile.save()
      }

      const uploadedFile = await cloudinary.uploader.upload(file.path, {
        folder: pathnameFile.split(path.sep).join("/"),
        use_filename: true,
        unique_filename: true,
      })

      const uniqHashName = uploadedFile.public_id.split("/").reverse()[0]

      if (!parentFile) {
        newFile.path = uniqHashName
      } else {
        newFile.path += path.sep + uniqHashName
      }

      newFile.preview = uploadedFile.url

      await newFile.save()

      return res.status(200).json(newFile)
    } catch (e) {
      console.log("ERROR UPLOAD", e)
      return res.status(500).json({
        message: "Error Upload",
      })
    }
  }

  async downloadFile(req, res) {
    try {
      const { id } = req.params
      const file = await File.findById(id)

      const filePath =
        fileService.getDefaultFilePath(file.user_id) + path.sep + file.path

      res.download(filePath, file)
    } catch (e) {
      console.log("ERROR DOWNLOAD FILE", e)
      return res.status(500).json({
        message: "Error DOWNLOAD FILE",
      })
    }
  }

  async deleteFile(req, res) {
    try {
      const { id } = req.params

      const file = await File.findById(id)

      if (file.parent_id) {
        const parentDir = await File.findById(file.parent_id)

        parentDir.size -= file.size

        if (parentDir.parent_dir) {
          await this.updateSizeParentDir(parentFile, { isDelete: true })
        }

        await parentDir.save()

        await File.updateOne(
          { _id: file.parent_id },
          { $pull: { childs_dir: file._id } }
        )
      }

      // fileService.deleteFile(file);
      await fileService.deleteCloudinaryFile(file)

      await file.deleteOne({ _id: id })

      const files = await File.find({
        parent_id: file.parent_id,
        user_id: req.userId,
      })

      return res.status(200).json(files)
    } catch (e) {
      console.log("ERROR DELETE FILE", e)
      return res.status(500).json({
        message: "Error DELETE FILE",
      })
    }
  }

  async uploadAvatar(req, res) {
    try {
      const { file } = req.files

      const avatarName = `${uuid.v4()}.jpg`

      const defaultPath =
        path.resolve(__dirname, "../static") + path.sep + avatarName

      file.mv(defaultPath)

      await User.findByIdAndUpdate(req.userId, {
        avatar: avatarName,
      })

      return res.status(200).json({
        message: "Avatar was uploaded",
      })
    } catch (e) {
      console.log("ERROR UPLOAD AVATAR", e)
      return res.status(500).json({
        message: "Error Upload",
      })
    }
  }

  async deleteAvatar(req, res) {
    try {
      const user = await User.findById(req.userId)
      const defaultPath = path.resolve(__dirname, "../static") + path.sep

      fs.unlinkSync(defaultPath + path.sep + user.avatar)

      user.avatar = null

      await user.save()

      return res.status(200).json({
        message: "Avatar was deleted",
      })
    } catch (e) {
      console.log("ERROR UPLOAD", e)
      return res.status(500).json({
        message: "Error delete",
      })
    }
  }

  async transformFile(req, res) {
    try {
      const file = req?.file
      const body = req.body
      console.log("body", body)
      // const initConfig = {

      // }

      // Object.entries(fileService.formats)
      //   .forEach(([keyFormat, valueFormat ]) => {
      //     if(valueFormat === body.type){
      //       initConfig[''] = body.type
      //     }
      // })

      // if(body.isCompress){
      //   initConfig
      // }
      // if(body.format)
      const formats = fileService.formats

      let sharpFile = sharp(file.path).resize({
        width: Number(body.width),
        height: Number(body.height),
        fit: sharp.fit.cover,
        // position: sharp.position.top,
      })

      switch (body.type) {
        case formats.PNG:
          sharpFile = Boolean(+body?.isCompress)
            ? sharpFile.png({ quality: 50 })
            : sharpFile.png()
          break
        case formats.JPEG:
          sharpFile = Boolean(+body?.isCompress)
            ? sharpFile.jpeg({ quality: 50 })
            : sharpFile.jpeg()
          break
        case formats.JPG:
          sharpFile = Boolean(+body?.isCompress)
            ? sharpFile.jpeg({ quality: 50 })
            : sharpFile.jpeg()
          break
        case formats.WEBP:
          sharpFile = Boolean(+body?.isCompress)
            ? sharpFile.webp({ quality: 50 })
            : sharpFile.webp()
          break
        default:
          return res.status(404).json({
            message: "Incorrect format",
          })
      }

      // .png()
      // .toBuffer({
      //   resolveWithObject: true,
      // })
      const bufferedFile = await sharpFile.toBuffer({
        resolveWithObject: true,
      })

      return res.status(200).json({
        message: "OK",
        imageInfo: bufferedFile.info,
        image: bufferedFile.data.toString("base64"),
        isDownload: Boolean(+body.isDownload),
      })
    } catch (error) {
      console.log("ERRor", error)
      return res.status(500).json({
        message: "Error delete",
      })
    }
  }
}

const fileController = new FileController()

module.exports = fileController
