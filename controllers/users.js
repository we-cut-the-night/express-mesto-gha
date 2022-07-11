const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { handleError } = require('../utils/errors');
const ConflictErr = require('../errors/409-conflict-err');
const AuthError = require('../errors/401-auth-err');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('notFoundErr'))
    .then((user) => res.status(200).send(user))
    .catch((err) => handleError(res, err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictErr('Пользователь с указанным email уже зарегистрирован'));
        return;
      } next(err);
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => handleError(res, err));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => handleError(res, err));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      if (err.code === 401) {
        next(new AuthError('Некорректный email или пароль'));
      } next(err);
    });
};

module.exports.getMyUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error('notFoundErr'))
    .then((user) => res.status(200).send(user))
    .catch((err) => handleError(res, err));
};
