const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors')
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
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit(RATE_LIMITER_CONFIGURATIONS);

const app = express();
mongoose.connect(MONGO_SERVER_ADDRESS);

app.use(limiter);
app.use(cors())
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.post('/signin', signinValidator, login);
app.post('/signup', signupValidator, createUser);
app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: `Route ${req.url} not found` });
});
app.use(errorLogger);
app.use(errors);
app.use(centralizedErrorHandler);
const { PORT = 3000 } = process.env;

app.listen(3001, () => {
  console.log(`App listening on port: ${PORT} `);
});
