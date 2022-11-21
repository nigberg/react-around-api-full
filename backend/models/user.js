const mongoose = require('mongoose');
const { URL_REGEXP } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return URL_REGEXP.test(v);
      },
      message: 'Avatar URL is not correct',
    },
  },
});
module.exports = mongoose.model('user', userSchema);
