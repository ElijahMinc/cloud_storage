const path = require('path');
const fs = require('fs');

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

  deleteFile(file) {
    const pathFile = path.join(this.getDefaultFilePath(file.user_id), file.path);

    if (file.type === 'dir') {
      fs.rmdirSync(pathFile);
    } else {
      fs.unlinkSync(pathFile);
    }
  }

  getDefaultFilePath(userId) {
    return path.join(this.filePath, `${userId}`);
  }

  generateDefaultPathFile(userId) {
    return path.sep + userId;
  }

  generateParentPath(file, parentFile) {
    return parentFile.path + path.sep + file.name;
  }

  get filePath() {
    return path.resolve(__dirname, '../files');
  }
}

module.exports = new FileService();
