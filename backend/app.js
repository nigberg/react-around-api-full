require('dotenv').config();

const { PORT = 3000 } = process.env;
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { NOT_FOUND_CODE, RATE_LIMITER_CONFIGURATIONS, MONGO_SERVER_ADDRESS } = require('./utils/constants');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const { signinValidator, signupValidator } = require('./utils/celebrateValidators');
const { NotFoundError } = require('./utils/errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit(RATE_LIMITER_CONFIGURATIONS);

const app = express();
mongoose.connect(MONGO_SERVER_ADDRESS);

app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});
app.post('/signin', signinValidator, login);
app.post('/signup', signupValidator, createUser);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use(auth, (req, res, next) => {
  const err = new NotFoundError(`Route ${req.url} not found`);
  err.statusCode = NOT_FOUND_CODE;
  next(err);
});
app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandler);

app.listen(PORT);
