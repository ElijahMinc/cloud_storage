const { model, Schema, Types } = require('mongoose');

const File = new Schema({
  name: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  size: {
    type: Number,
    default: 0,
  },
  path: {
    type: String,
  },
  date: {
    type: Date,
  },
  parent_id: {
    type: Types.ObjectId,
    ref: 'File',
  }, // parent будет ссылаться на файл ( в частиности папку, в которой он находится )
  childs_dir: [{
    type: Types.ObjectId,
    ref: 'File',
  }], // childs
  user_id: {
    type: Types.ObjectId,
    ref: 'User',
  }, // пользователь, который добавил файл
});

File.index({ name: 'text' })

module.exports = model('File', File);

File.clearIndexes()
