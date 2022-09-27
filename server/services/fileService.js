const path = require('path');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary')

class FileService {
  createDir(file, parentFile) {
    let pathname = this.getDefaultFilePath(file.user_id);

    if (parentFile && parentFile.childs_dir.length) { // если существует свойство с айди парент,то значит это вложенная папка
      pathname += path.sep + parentFile.path + path.sep + file.name;
    } else {
      pathname += path.sep + file.name;
    }

    if (fs.existsSync(pathname)) {
      throw new Error('Папка уже существует');
    }

    fs.mkdirSync(pathname, { recursive: true });
  }

  async createPersonFolder(userId){
    await cloudinary.api.create_folder(this.getDefaultFilePath(userId).replace(path.sep, '/'))
  }

  async createCloudinaryDir(file, parentFile) {
    let pathname = this.getDefaultFilePath(file.user_id);

    if (parentFile && parentFile.childs_dir.length) { // если существует свойство с айди парент,то значит это вложенная папка
      pathname += path.sep + parentFile.path + path.sep + file.name;
    } else {
      pathname += path.sep + file.name;
    }

    const isExist = await this.isExistFolder(pathname, file)

    console.log('isExist', isExist)
    if (isExist) { //?
      throw new Error('The folder already exists');
    }


    try {
      console.log('pathname', pathname.split(path.sep).slice(1).join('/'))
      await cloudinary.api.create_folder(pathname.split(path.sep).join('/'))

    } catch (error) {
      console.log(error)
      throw new Error('Error with creating folder :C');

    }
 }

  async deleteCloudinaryFile(file){
    const defaultPath = this.getDefaultFilePath(file.user_id);
    const pathDir = defaultPath + path.sep + file.path
    console.log('pathFile', pathDir.split(path.sep).join('/'))
    if (file.type === 'dir') {
      await cloudinary.api.delete_folder(pathDir.split(path.sep).join('/'))

    } else {
      const pathFile = defaultPath + path.sep + file.path
      await cloudinary.uploader.destroy(pathFile.split(path.sep).join('/'))
    }
  }

  deleteFile(file) {
    const pathFile = path.join(this.getDefaultFilePath(file.user_id), file.path);

    if (file.type === 'dir') {
      fs.rmdirSync(pathFile);
    } else {
      fs.unlinkSync(pathFile);
    }
  }

  getDefaultFilePath(userId) {
    return this.rootFolder + path.sep + userId
  }

  generateParentPath(file, parentFile) {
    return parentFile.path + path.sep + file.name;
  }

 async isExistFolder(pathnameFolder, file){
    const parentFolder = this.getParentFolder(pathnameFolder)
    console.log('parentFolder', parentFolder)
    const allRootFolders = await cloudinary.api.sub_folders(parentFolder) // root folder name
    return allRootFolders.folders.some(({ name }) =>  name === file.name)
  }

  getParentFolder(pathname){
    return pathname
      .split(path.sep)
      .reverse()
      .slice(1)
      .reverse()
      .join('/')
  }
  get rootFolder(){
    return 'cloud-mern'
  }
}

module.exports = new FileService();
