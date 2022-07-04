const router = require('express').Router();
const {
  getUser, getUserById, createUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
