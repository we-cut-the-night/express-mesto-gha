const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/card');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, 'build')));
app.use((req, res, next) => {
  req.user = {
    _id: '62c0b9c245c445ce45cccfa2', // Test user 2
  };

  next();
});
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});
