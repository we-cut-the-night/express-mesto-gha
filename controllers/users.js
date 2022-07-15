const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { handleError } = require('../utils/errors');
const AuthError = require('../errors/401-auth-err');
const NotFoundErr = require('../errors/404-not-found-err');
const ConflictErr = require('../errors/409-conflict-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(new NotFoundErr('Пользователь не найден'));
      } return res.status(200).send(user);
    })
    .catch((err) => handleError(res, err, next));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((oldUser) => {
      if (oldUser) {
        next(new ConflictErr('Пользователь с таким email уже существует'));
        return;
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        .then((newUser) => res.send({
          name: newUser.name, about: newUser.about, avatar: newUser.avatar,
        }))
        .catch((err) => handleError(res, err, next));
    })
    .catch((err) => handleError(res, err, next));
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => handleError(res, err, next));
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => handleError(res, err, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new AuthError('Некорректный email или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new AuthError('Некорректный email или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.status(200).send({ token });
        })
        .catch((err) => handleError(res, err, next));
    })
    .catch((err) => handleError(res, err, next));
};

module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('notFoundErr'))
    .then((user) => res.status(200).send(user))
    .catch((err) => handleError(res, err, next));
};
