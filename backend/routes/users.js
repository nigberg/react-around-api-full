const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getAllUsers, getUser, updateProfile, updateAvatar, getCurrentUserInfo
} = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/me', auth, getCurrentUserInfo);
router.get('/users/:id', getUser);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
