const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/card');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { regex } = require('./utils/regex');
const NotFoundErr = require('./errors/404-not-found-err');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regex),
  }),
}), createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use((req, res, next) => next(new NotFoundErr('Страница не найдена')));

app.use(errors({ message: 'Одна ошибка, и ты ошибься' }));

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  // res.status(statusCode).send(err);

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });

  next();
});

app.listen(PORT, () => {
  console.log('App started and listen port', PORT);
});
