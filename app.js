const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/card');
const { login, createUser } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
const PORT = 3000;

app.use(helmet());

app.use(bodyParser.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});
