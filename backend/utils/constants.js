module.exports.NOT_FOUND_CODE = 404;
module.exports.SERVER_ERROR_CODE = 500;
module.exports.INVALID_DATA_CODE = 400;
module.exports.OK_CODE = 200;
module.exports.OK_CREATED_CODE = 201;
module.exports.URL_REGEXP = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
module.exports.RATE_LIMITER_CONFIGURATIONS = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
};
module.exports.MONGO_SERVER_ADDRESS = 'mongodb://localhost:27017/aroundb';
module.exports.NOT_FOUND_MESSAGE = 'Not found error';
module.exports.INVALID_DATA_MESSAGE = 'Invalid data error';
module.exports.AUTHORIZATION_ERROR_MESSAGE = 'Authorization error';
module.exports.SERVER_ERROR_MESSAGE = 'Internal server error';
module.exports.SECRET_KEY = 'ptnpnh';
