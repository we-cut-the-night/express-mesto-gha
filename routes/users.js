const router = require('express').Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
      // console.log(users)
    });
});

router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      res.status(200).send(user);
    });
});

router.post('/', (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch(() => res.send('Что-то пошло не так...'));
  // console.log('post', req.body)
});

module.exports = router;
