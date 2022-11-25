const {
  OK_CODE,
  OK_CREATED_CODE,
  INVALID_DATA_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  NOT_FOUND_MESSAGE,
  INVALID_DATA_MESSAGE,
  SERVER_ERROR_MESSAGE,
} = require('../utils/constants')
const Card = require('../models/card')

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(OK_CODE).send({ data: cards })
    })
    .catch(() => {
      res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE })
    })
}

const createCard = (req, res) => {
  const { name, link } = req.body
  const owner = req.user._id
  Card.create({ name, owner, link })
    .then((card) => {
      res.status(OK_CREATED_CODE).send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errorsMessage = `${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')}`
        res.status(INVALID_DATA_CODE).send({ message: errorsMessage })
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE })
      }
    })
}

const deleteCard = (req, res) => {
  const { cardId } = req.params
  Card.findById(cardId)
    .orFail(() => {
      const err = new Error(NOT_FOUND_MESSAGE)
      err.status = NOT_FOUND_CODE
      throw err
    })
    .then((card) => {
      console.log("found card for\delete "+card)
      if (card.owner.toString() !== req.user._id) {
        const err = new Error('Not allowed')
        err.status = 403
        throw err
      }
      return Card.findByIdAndDelete(cardId)
    })
    .then((removedCard) => {
      console.log(removedCard)
      res.send({ data: removedCard })
    })
    .catch((err) => {
      if (err.status === NOT_FOUND_CODE) {
        res.status(NOT_FOUND_CODE).send({ message: err.message })
      } else if (err.name === 'CastError') {
        res.status(INVALID_DATA_CODE).send({ message: INVALID_DATA_MESSAGE })
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE })
      }
    })
}

const likeCard = (req, res) => {
  const userId = req.user._id
  const { cardId } = req.params
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      const err = new Error(NOT_FOUND_MESSAGE)
      err.status = NOT_FOUND_CODE
      throw err
    })
    .then((card) => {
      res.status(OK_CREATED_CODE).send({ data: card })
    })
    .catch((err) => {
      if (err.status === NOT_FOUND_CODE) {
        res.status(NOT_FOUND_CODE).send({ message: err.message })
      } else if (err.name === 'CastError') {
        res.status(INVALID_DATA_CODE).send({ message: INVALID_DATA_MESSAGE })
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE })
      }
    })
}

const unlikeCard = (req, res) => {
  const userId = req.user._id
  const { cardId } = req.params
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      const err = new Error(NOT_FOUND_MESSAGE)
      err.status = NOT_FOUND_CODE
      throw err
    })
    .then((card) => {
      res.status(OK_CREATED_CODE).send({ data: card })
    })
    .catch((err) => {
      if (err.status === NOT_FOUND_CODE) {
        res.status(NOT_FOUND_CODE).send({ message: err.message })
      } else if (err.name === 'CastError') {
        res.status(INVALID_DATA_CODE).send({ message: INVALID_DATA_MESSAGE })
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE })
      }
    })
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
}
