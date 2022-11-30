const router = require('express').Router()
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

router.get('/cards', getAllCardsValidator, getAllCards)
router.post('/cards', createCardValidator, createCard)
router.delete('/cards/:cardId', deleteCardValidator, deleteCard)
router.put('/cards/likes/:cardId', likeCardValidator, likeCard)
router.delete('/cards/likes/:cardId', unlikeCardValidator, unlikeCard)

module.exports = router
