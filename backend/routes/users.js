const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getAllUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');
const {
  getUserValidator,
  updateProfileValidator,
  updateAvatarValidator,
} = require('../utils/celebrateValidators');

router.get('/users', auth, getAllUsers);
router.get('/users/me', auth, getCurrentUserInfo);
router.get('/users/:id', auth, getUserValidator, getUser);
router.patch('/users/me', auth, updateProfileValidator, updateProfile);
router.patch('/users/me/avatar', auth, updateAvatarValidator, updateAvatar);

module.exports = router;
