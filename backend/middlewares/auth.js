const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/constants');

const { SECRET_JWT = SECRET_KEY } = process.env;
const AuthorizationError = require('../utils/errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new AuthorizationError('Authorization required');
    next(err);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_JWT);
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};
