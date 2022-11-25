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

const limiter = rateLimit(RATE_LIMITER_CONFIGURATIONS);

const app = express();
mongoose.connect(MONGO_SERVER_ADDRESS);

app.use(limiter);
app.use(cors())
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: `Route ${req.url} not found` });
});
const { PORT = 3000 } = process.env;

app.listen(3001, () => {
  console.log(`App listening on port: ${PORT} `);
});
