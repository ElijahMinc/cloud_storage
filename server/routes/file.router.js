const { Router } = require('express');
const fileController = require('../controllers/fileController.js');

const authMiddleware = require('../middlewares/auth.middleware.js');

const file = Router();

file.get('/', authMiddleware, fileController.fetchFiles);
file.post('/', authMiddleware, fileController.createDir);
file.get('/download/:id', authMiddleware, fileController.downloadFile);
file.delete('/:id', authMiddleware, fileController.deleteFile);

file.post('/upload', authMiddleware, fileController.uploadFile);
file.post('/avatar/upload', authMiddleware, fileController.uploadAvatar);
file.delete('/avatar/delete', authMiddleware, fileController.deleteAvatar);

module.exports = file;
