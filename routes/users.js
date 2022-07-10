const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getMyUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getMyUser);
router.get('/:id', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
