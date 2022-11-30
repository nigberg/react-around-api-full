const {
  OK_CODE,
  OK_CREATED_CODE,
  INVALID_DATA_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  NOT_FOUND_MESSAGE,
  INVALID_DATA_MESSAGE,
  SERVER_ERROR_MESSAGE,
  AUTHORIZATION_ERROR_MESSAGE
} = require('../utils/constants')

const { NotFoundError, AuthorizationError, BadRequestError, ForbiddenError } = require('../utils/errors')
const Card = require('../models/card')

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(OK_CODE).send({ data: cards })
    })
    .catch(next)
}

const createCard = (req, res, next) => {
  const { name, link } = req.body
  const owner = req.user._id
  Card.create({ name, owner, link })
    .then((card) => {
      res.status(OK_CREATED_CODE).send({ data: card })
    })
    .catch(next)
}

const deleteCard = (req, res, next) => {
  const { cardId } = req.params
  Card.findById(cardId)
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE)
      throw err
    })
    .then((card) => {
      console.log("found card for\delete "+card)
      if (card.owner.toString() !== req.user._id) {
        const err = new ForbiddenError('Not allowed')
        throw err
      }
      return Card.findByIdAndDelete(cardId)
    })
    .then((removedCard) => {
      console.log(removedCard)
      res.send({ data: removedCard })
    })
    .catch(next)
}

const likeCard = (req, res, next) => {
  const userId = req.user._id
  const { cardId } = req.params
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE)
      throw err
    })
    .then((card) => {
      res.status(OK_CREATED_CODE).send({ data: card })
    })
    .catch(next)
}

const unlikeCard = (req, res, next) => {
  const userId = req.user._id
  const { cardId } = req.params
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE)
      throw err
    })
    .then((card) => {
      res.status(OK_CREATED_CODE).send({ data: card })
    })
    .catch(next)
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
}
