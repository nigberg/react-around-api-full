const {
  OK_CODE,
  OK_CREATED_CODE,
  INVALID_DATA_CODE,
  NOT_FOUND_CODE,
  SERVER_ERROR_CODE,
  NOT_FOUND_MESSAGE,
  INVALID_DATA_MESSAGE,
  SERVER_ERROR_MESSAGE,
  SECRET_KEY,
} = require('../utils/constants')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(OK_CODE).send({ data: users })
    })
    .catch(() => {
      res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE })
    })
}

const getCurrentUserInfo = (req, res) => {
  const { _id } = req.user
  User.findById(_id)
    .orFail(() => {
      const err = new Error(NOT_FOUND_MESSAGE)
      err.status = NOT_FOUND_CODE
      throw err
    })
    .then((user) => {
      res.status(OK_CODE).send({ data: user })
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

const getUser = (req, res) => {
  const { id } = req.params
  User.findById(id)
    .orFail(() => {
      const err = new Error(NOT_FOUND_MESSAGE)
      err.status = NOT_FOUND_CODE
      throw err
    })
    .then((user) => {
      res.status(OK_CODE).send({ data: user })
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

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      if (!password) {
        return Promise.reject(new Error('pwd required'))
      }
      if (user) {
        return Promise.reject(new Error('user exists'))
      }
      return bcrypt.hash(password, 10)
    })
    .then((hash) => {
      return User.create({ name, about, avatar, email, password: hash })
    })
    .then((user) => {
      res.status(OK_CREATED_CODE).send({ data: user })
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

const updateProfile = (req, res) => {
  const userId = req.user._id
  const { name, about } = req.body
  User.findById(userId)
    .orFail(() => {
      const err = new Error(NOT_FOUND_MESSAGE)
      err.status = NOT_FOUND_CODE
      throw err
    })
    .then((user) => {
      return User.findByIdAndUpdate(
        userId,
        { name, about },
        { new: true, runValidators: true },
      )
    })
    .then((updatedUser) => {
      res.status(OK_CREATED_CODE).send({ data: updatedUser })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errorsMessage = `${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')}`
        res.status(INVALID_DATA_CODE).send({ message: errorsMessage })
      } else if (err.name === 'CastError') {
        res.status(INVALID_DATA_CODE).send({ message: INVALID_DATA_MESSAGE })
      } else if (err.status === NOT_FOUND_CODE) {
        res.status(NOT_FOUND_CODE).send({ message: err.message })
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE })
      }
    })
}

const updateAvatar = (req, res) => {
  const userId = req.user._id
  const { avatar } = req.body
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const err = new Error(NOT_FOUND_MESSAGE)
      err.status = NOT_FOUND_CODE
      throw err
    })
    .then((user) => {
      res.status(OK_CREATED_CODE).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errorsMessage = `${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')}`
        res.status(INVALID_DATA_CODE).send({ message: errorsMessage })
      } else if (err.name === 'CastError') {
        res.status(INVALID_DATA_CODE).send({ message: INVALID_DATA_MESSAGE })
      } else if (err.status === NOT_FOUND_CODE) {
        res.status(NOT_FOUND_CODE).send({ message: err.message })
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE })
      }
    })
}

const login = (req, res) => {
  const { email, password } = req.body
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // user found
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' })
      res.send({ token })
    })
    .catch((err) => {
      res.status(401).send(err.message)
    })
}

module.exports = {
  getAllUsers,
  getCurrentUserInfo,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
}
