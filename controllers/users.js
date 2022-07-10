const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { handleError } = require('../utils/errors');

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

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => handleError(res, err));
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      } return bcrypt.compare(password, user.password)
        .then((matched) => {
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          } return res.send({ token });
        });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getMyUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(new Error('notFoundErr'))
    .then((user) => res.status(200).send(user))
    .catch((err) => handleError(res, err));
};
