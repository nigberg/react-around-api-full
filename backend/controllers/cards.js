const {
  OK_CREATED_CODE,
  NOT_FOUND_MESSAGE,
} = require('../utils/constants');

const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const BadRequestError = require('../utils/errors/BadRequestError');
const Card = require('../models/card');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, owner, link })
    .then((card) => {
      res.status(OK_CREATED_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE);
      throw err;
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        const err = new ForbiddenError('Not allowed');
        throw err;
      }
      return Card.findByIdAndDelete(cardId);
    })
    .then((removedCard) => {
      res.send({ data: removedCard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid ID'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE);
      throw err;
    })
    .then((card) => {
      res.status(OK_CREATED_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid ID'));
      } else {
        next(err);
      }
    });
};

const unlikeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE);
      throw err;
    })
    .then((card) => {
      res.status(OK_CREATED_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid ID'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
