const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser} = require('./controllers/users');
const auth = require('./middlewares/auth');
const { NOT_FOUND_CODE, RATE_LIMITER_CONFIGURATIONS, MONGO_SERVER_ADDRESS } = require('./utils/constants');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');
const { errors } = require('celebrate');
const { signinValidator, signupValidator } = require('./utils/celebrateValidators');
const { NotFoundError } = require('./utils/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
require('dotenv').config();

const limiter = rateLimit(RATE_LIMITER_CONFIGURATIONS);

const app = express();
mongoose.connect(MONGO_SERVER_ADDRESS);

app.use(limiter);
app.use(cors());
app.options('*', cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.post('/signin', signinValidator, login);
app.post('/signup', signupValidator, createUser);
//app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((req, res, next) => {
  const err = new NotFoundError(`Route ${req.url} not found`);
  err.statusCode = NOT_FOUND_CODE;
  next(err);
});
app.use(errorLogger);
app.use(errors);
app.use(centralizedErrorHandler);

const { NODE_ENV = 'test' } = process.env;
const { PORT = 3000 } = process.env;


app.listen(PORT, () => {
  console.log(`App listening on port: ${PORT}, NODE_ENV is ${NODE_ENV} `);
});
