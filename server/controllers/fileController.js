const path = require("path")
const fs = require("fs")
const uuid = require("uuid")
const File = require("../modules/File.js")
const User = require("../modules/User.js")
const fileService = require("../services/fileService.js")
const cloudinary = require("../utils/cloudinary")

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

        // fileService.createDir(file, parentFile);
        await fileService.createCloudinaryDir(file, parentFile)

        file.parent_id = parentId

        await parentFile.save()
      } else {
        pathFile = file.name

        // fileService.createDir(file);
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

  async uploadFile(req, res) {
    try {
      const file = req?.file
      console.log("file", file)
      // file.originalname = file.filename + `.${file.mimetype.split('/')[1]}`
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
      // if(file.size + user.usedSpace > user.diskSpace){
      //    return res.status(400).json({
      //       message: 'File is very big'
      //    })
      // }
      newFile.size = file.size + user.usedSpace

      let pathnameFile = fileService.getDefaultFilePath(newFile.user_id)

      if (parentFile) {
        // const pathUploadParentFile = parentFile.path + path.sep + newFile.name

        const pathParentFile = path.sep + parentFile.path
        pathnameFile += pathParentFile

        // if (fs.existsSync(fileService.filePath + pathnameFile)) {
        //   throw new Error('The file is already exist');
        // }

        newFile.parent_id = parentId

        newFile.path = parentFile.path
        parentFile.size += newFile.size
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
        if(file.type !== 'dir'){
          
          const parentDir = await File.findById(file.parent_id)

          parentDir.size -= file.size

          await parentDir.save()
        }

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
}

module.exports = new FileController()
