const { model, Schema } = require('mongoose');

const User = Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  usedSpace: {
    type: Number,
    default: 50000,
  },
  diskSpace: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
  },
  // file: {
  //    type: String,
  //    ref: 'File'
  // }
});

module.exports = model('User', User);
