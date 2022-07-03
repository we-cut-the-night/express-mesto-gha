const User = require('../models/user');

module.exports.createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
