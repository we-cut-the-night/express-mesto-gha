const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

const PORT = 3001;

app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, 'build')));

app.use('/users', userRouter);

app.listen(PORT, () => {
  // console.log('App started and listen port', PORT);
});
