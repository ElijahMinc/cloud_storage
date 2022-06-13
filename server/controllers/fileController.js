const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const File = require('../modules/File.js');
const User = require('../modules/User.js');
const fileService = require('../services/fileService.js');
class FileController {
  async createDir(req, res) {
    try {
      const { name, parentId } = req.body;

      const file = new File({
        name,
        type: 'dir',
        date: new Date(),
        user_id: req.userId,
      });

      const parentFile = await File.findOne({ _id: parentId });

      let pathFile;

      if (parentFile) {
        pathFile = parentFile.path + path.sep + file.name;

        parentFile.childs_dir.push(file._id);

        fileService.createDir(file, parentFile);

        file.parent_id = parentId;

        await parentFile.save();
      } else {
        pathFile = file.name;

        fileService.createDir(file);
      }

      file.path = pathFile;

      await file.save();

      return res.status(200).json(file);
    } catch (e) {
      console.log('ERROR', e);
      res.status(500).json({
        message: 'Ошибка создания папки',
      });
    }
  }

  async fetchFiles(req, res) {
    try {
      const { search, filter, sort } = req.query
      const queryParams =  {
         parent_id: req.query.id, 
         user_id: req.userId,
      }

      if(search) {
        queryParams.$text = { $search: search, $diacriticSensitive: true }
      }

      let files = await File.find(queryParams).sort({date: sort});

      return res.status(200).json(files);
    } catch (e) {
      return res.status(400).json({
        message: 'Ошибка в получении файлов',
      });
    }
  }

  async uploadFile(req, res) {
    try {
      const { file } = req.files;
      const { parentId } = req.body;

      const parentFile = await File.findOne({ _id: parentId });
      const user = await User.findOne({ _id: req.userId });
      const typeFile = file.name.split('.')[1];

      const newFile = new File({
        name: file.name,
        type: typeFile,
        user_id: req.userId,
        date: new Date()
      });
      // if(file.size + user.usedSpace > user.diskSpace){
      //    return res.status(400).json({
      //       message: 'File is very big'
      //    })
      // }
      newFile.size = file.size + user.usedSpace;

      let pathFile = fileService.generateDefaultPathFile(req.userId);

      if (parentFile) {

        const pathUploadParentFile = parentFile.path + path.sep + newFile.name

        pathFile += path.sep + pathUploadParentFile;

        if (fs.existsSync(fileService.filePath + pathFile)) {
          throw new Error('Папка уже существует');
        }

        newFile.parent_id = parentId;

        newFile.path = pathUploadParentFile;

        parentFile.childs_dir.push(newFile._id);

        await parentFile.save();
      } else {
        const pathUploadFile = file.name

        pathFile += path.sep + pathUploadFile;

        if (fs.existsSync(fileService.filePath + pathFile)) {
          throw new Error('Папка уже существует');
        }
        newFile.path = file.name;

      }

      file.mv(fileService.filePath + pathFile);

      await newFile.save();

      return res.status(200).json(newFile);
    } catch (e) {
      console.log('ERROR UPLOAD', e);
      return res.status(500).json({
        message: 'Error Upload',
      });
    }
  }

  async downloadFile(req, res) {
    try {
        const { id } = req.params
        const file = await File.findById(id)

        const filePath = fileService.getDefaultFilePath(file.user_id) + path.sep + file.path

        res.download(filePath, file)

    } catch (e) {
      console.log('ERROR DOWNLOAD FILE', e);
      return res.status(500).json({
        message: 'Error DOWNLOAD FILE',
      });
    }
  }

  async deleteFile(req, res) {
    try {
      const { id } = req.params;

      const file = await File.findById(id);

      if (file.parent_id) {
        await File.updateOne({ _id: file.parent_id }, { $pull: { childs_dir: file._id } });
      }

      fileService.deleteFile(file);

      await file.deleteOne({ _id: id });


      const files = await File.find({ parent_id: file.parent_id, user_id: req.userId });

      return res.status(200).json(files);

    } catch (e) {
      console.log('ERROR DELETE FILE', e);
      return res.status(500).json({
        message: 'Error DELETE FILE',
      });
    }
  }

  async uploadAvatar(req, res) {
    try {
      const { file } = req.files;

      const avatarName = `${uuid.v4()}.jpg`;

      const defaultPath = path.resolve(__dirname, '../static') + path.sep + avatarName;

      file.mv(defaultPath);

      await User.findByIdAndUpdate(req.userId, {
        avatar: avatarName,
      });

      return res.status(200).json({
        message: 'Avatar was uploaded',
      });
    } catch (e) {
      console.log('ERROR UPLOAD AVATAR', e);
      return res.status(500).json({
        message: 'Error Upload',
      });
    }
  }

  async deleteAvatar(req, res) {
    try {
      const user = await User.findById(req.userId);
      const defaultPath = path.resolve(__dirname, '../static') + path.sep;

      fs.unlinkSync(defaultPath + path.sep + user.avatar);

      user.avatar = null;

      await user.save();

      return res.status(200).json({
        message: 'Avatar was deleted',
      });
    } catch (e) {
      console.log('ERROR UPLOAD', e);
      return res.status(500).json({
        message: 'Error delete',
      });
    }
  }
}

module.exports = new FileController();
