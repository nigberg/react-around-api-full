const router = require('express').Router()
const auth = require('../middlewares/auth')
const {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards')
const {
  getAllCardsValidator,
  createCardValidator,
  deleteCardValidator,
  likeCardValidator,
  unlikeCardValidator,
} = require('../utils/celebrateValidators')

router.get('/cards', auth, getAllCardsValidator, getAllCards)
router.post('/cards', auth, createCardValidator, createCard)
router.delete('/cards/:cardId', auth, deleteCardValidator, deleteCard)
router.put('/cards/likes/:cardId', auth, likeCardValidator, likeCard)
router.delete('/cards/likes/:cardId', auth, unlikeCardValidator, unlikeCard)

module.exports = router
