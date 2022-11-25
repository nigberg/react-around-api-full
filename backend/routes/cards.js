const router = require('express').Router();
const {
  getAllCards, createCard, deleteCard, likeCard, unlikeCard,
} = require('../controllers/cards');

router.get('/cards', getAllCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/likes/:cardId', likeCard);
router.delete('/cards/likes/:cardId', unlikeCard);

module.exports = router;
