const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');
const {
  createCardValidator,
  deleteCardValidator,
  likeCardValidator,
  unlikeCardValidator,
} = require('../utils/celebrateValidators');

router.get('/cards', auth, getAllCards);
router.post('/cards', auth, createCardValidator, createCard);
router.delete('/cards/:cardId', auth, deleteCardValidator, deleteCard);
router.put('/cards/:cardId/likes', auth, likeCardValidator, likeCard);
router.delete('/cards/:cardId/likes', auth, unlikeCardValidator, unlikeCard);

module.exports = router;
