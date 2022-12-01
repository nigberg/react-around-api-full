const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/constants');
const { SECRET_JWT = SECRET_KEY } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if(!authorization || !authorization.startsWith('Bearer ')){
    return res.status(401).send({ message: 'Authorization required' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try{
    payload = jwt.verify(token, SECRET_JWT);
  }catch(err){
    return res.status(401).send({ message: 'Authorization required' });
  }
  req.user = payload;
  next();
};