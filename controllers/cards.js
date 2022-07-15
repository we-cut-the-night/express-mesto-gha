const Card = require('../models/card');
const { handleError } = require('../utils/errors');
const NotFoundErr = require('../errors/404-not-found-err');
const ForbiddenErr = require('../errors/403-forbidden-err');

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
    .orFail(new NotFoundErr('Карточка не найдена'))
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        return Promise.reject(new ForbiddenErr('Нельзя удалить карточку другого пользователя'));
      } return Card.findByIdAndRemove(req.params.id);
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => handleError(res, err));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundErr('Карточка не найдена'))
    .then((like) => {
      res.status(200).send(like);
    })
    .catch((err) => handleError(res, err));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundErr('Карточка не найдена'))
    .then((like) => {
      res.status(200).send(like);
    })
    .catch((err) => handleError(res, err));
};
