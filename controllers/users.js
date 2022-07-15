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

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotFoundErr('Пользователь не найден'));
      } return res.status(200).send(user);
    })
    .catch((err) => handleError(res, err));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((isTrue) => {
      if (isTrue) {
        return Promise.reject(new ConflictErr('Пользователь с таким email уже существует'));
      }

      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, about, avatar, email, password: hash,
        }))
        .then((user) => res.send({
          name: user.name, about: user.about, avatar: user.avatar,
        }))
        .catch((err) => handleError(res, err));
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

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Некорректный email или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Некорректный email или пароль'));
          } return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getMyUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error('notFoundErr'))
    .then((user) => res.status(200).send(user))
    .catch((err) => handleError(res, err));
};
