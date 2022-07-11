const Card = require('../models/card');
const { handleError } = require('../utils/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(next);
};

module.exports.getCardbyId = (req, res) => {
  Card.findById(req.params.id)
    .orFail(new Error('notFoundErr'))
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => handleError(res, err));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => handleError(res, err));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.id)
    .orFail(new Error('notFoundErr'))
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        return res.status(400).send({ message: 'Недостаточно прав' });
      } return Card.findByIdAndRemove(req.params.id);
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => handleError(res, err));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('notFoundErr'))
    .then((card) => res.status(200).send(card))
    .catch((err) => handleError(res, err));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('notFoundErr'))
    .then((card) => res.status(200).send(card))
    .catch((err) => handleError(res, err));
};
