require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors')
const app = express();

const corsMiddleware = require('./middlewares/cors.middlewares.js');


const fileUpload = require('express-fileupload');

const authRouter = require('./routes/auth.router.js');

const fileRouter = require('./routes/file.router.js');

app.use(cors())
app.use(fileUpload({}));

app.use(express.static('static'));

app.use(express.json());

app.use('/auth', corsMiddleware, authRouter);
app.use('/file', corsMiddleware, fileRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_CONNECT);

    app.listen(process.env.PORT, () => console.log('Server started'));
  } catch (e) {
    console.log(e);
  }
};

start();
