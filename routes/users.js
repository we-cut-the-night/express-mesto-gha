const router = require('express').Router();
const User = require('../models/user');
const { createUser } = require('../controllers/users');

router.get('/', (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    });
});

router.get('/:id', (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      res.status(200).send(user);
    });
});

router.post('/', createUser);

module.exports = router;
