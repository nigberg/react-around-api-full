const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  OK_CODE,
  OK_CREATED_CODE,
  NOT_FOUND_MESSAGE,
  SECRET_KEY,
} = require('../utils/constants');

const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictError = require('../utils/errors/ConflictError');

const User = require('../models/user');

const { SECRET_JWT = SECRET_KEY } = process.env;

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(OK_CODE).send({ data: users });
    })
    .catch(next);
};

const getCurrentUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE);
      throw err;
    })
    .then((user) => {
      res.status(OK_CODE).send({ data: user });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE);
      throw err;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid ID'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new ConflictError('User with this email is already exists'));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const userDataResponse = {
        name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
      };
      res.status(OK_CREATED_CODE).send({ data: userDataResponse });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findById(userId)
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE);
      throw err;
    })
    .then(() => User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    ))
    .then((updatedUser) => {
      res.status(OK_CREATED_CODE).send({ data: updatedUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE);
      throw err;
    })
    .then((user) => {
      res.status(OK_CREATED_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // user found
      const token = jwt.sign({ _id: user._id }, SECRET_JWT, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  getCurrentUserInfo,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
