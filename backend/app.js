const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const morgan = require('morgan');
const logger = require('./logger');
const { PORT, MONGO_URL } = require('./config');
const router = require('./routes');
const errorHandler = require('./utils/errorHandler');

const app = express();

// подключение к MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => logger.info('Database is connected'))
  .catch((err) => logger.error('Error connecting to the database', err));

mongoose.set({ runValidators: true });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// настраиваем заголовки
app.use(helmet());

// настраиваем миддлвэр для ограничения кол-ва запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'http://olpoma.students.nomoredomains.rocks',
  'https://olpoma.students.nomoredomains.rocks',
  'https://api.olpoma.students.nomoredomains.rocks',
  'http://api.olpoma.students.nomoredomains.rocks',
  'http://localhost:3000',
  'localhost:3000',
];

// Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

app.use((req, res, next) => {
  const { origin, method } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.status(200).end();
  }

  return next();
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Логирование запросов
app.use(morgan('tiny', {
  stream: {
    write: (message) => {
      logger.info(message.trim());
    },
  },
}));

// Логирование ошибок
app.use((err, req, res, next) => {
  logger.error(err.stack);
  next(err);
});

// используем корневой рутер
app.use('/', router);

// Обработка ошибок Joi validation
app.use(errors());

// подключаем централизованный обработчик ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`App listening on port ${PORT}`);
});
