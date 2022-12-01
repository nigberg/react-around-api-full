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

const { NotFoundError, AuthorizationError, BadRequestError, ForbiddenError, ConflictError } = require('../utils/errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { SECRET_JWT = SECRET_KEY } = process.env

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(OK_CODE).send({ data: users })
    })
    .catch(next)
}

const getCurrentUserInfo = (req, res, next) => {
  const { _id } = req.user
  User.findById(_id)
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE)
      throw err
    })
    .then((user) => {
      res.status(OK_CODE).send({ data: user })
    })
    .catch(next)
}

const getUser = (req, res, next) => {
  const { id } = req.params
  User.findById(id)
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE)
      throw err
    })
    .then((user) => {
      res.status(OK_CODE).send({ data: user })
    })
    .catch(next)
}

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      if (!password) {
        return Promise.reject(new BadRequestError('Password is missing'))
      }
      if (user) {
        return Promise.reject(new ConflictError('User with this email is already exists'))
      }
      return bcrypt.hash(password, 10)
    })
    .then((hash) => {
      return User.create({ name, about, avatar, email, password: hash })
    })
    .then((user) => {
      res.status(OK_CREATED_CODE).send({ data: user })
    })
    .catch(next)
}

const updateProfile = (req, res, next) => {
  const userId = req.user._id
  const { name, about } = req.body
  User.findById(userId)
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE)
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
    .catch(next)
}

const updateAvatar = (req, res, next) => {
  const userId = req.user._id
  const { avatar } = req.body
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const err = new NotFoundError(NOT_FOUND_MESSAGE)
      throw err
    })
    .then((user) => {
      res.status(OK_CREATED_CODE).send({ data: user })
    })
    .catch(next)
}

const login = (req, res, next) => {
  const { email, password } = req.body
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // user found
      const token = jwt.sign({ _id: user._id }, SECRET_JWT, { expiresIn: '7d' })
      res.send({ token })
    })
    .catch(next)
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
