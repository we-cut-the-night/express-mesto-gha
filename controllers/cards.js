const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((user) => res.status(201).send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
