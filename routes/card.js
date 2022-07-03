const router = require('express').Router();
const Card = require('../models/card');
const { createCard } = require('../controllers/cards');

router.get('/', (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    });
});

router.get('/:id', (req, res) => {
  Card.findOne({ _id: req.params.id })
    .then((card) => {
      res.status(200).send(card);
    });
});

router.post('/', createCard);

module.exports = router;
