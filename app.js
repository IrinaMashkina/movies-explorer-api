require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const limiter = require('./middlewares/rateLimit');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 5000 } = process.env;
const { BASE_URL = "mongodb://localhost:27017/bitfilmsdb" } = process.env;

const router = require("./routes/index");

const NotFoundError = require("./errors/not-found-err");
const ForbiddenError = require("./errors/forbidden-err");

const { errors } = require("celebrate");

mongoose.connect(BASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => console.log("Mongodb connected"));
mongoose.connection.on("error", (err) => console.log(`Ошибка ${err}`));

const whitelist = [
  "http://localhost:3000",
  "http://diploma-movies-explorer.nomoredomains.club",
  "https://diploma-movies-explorer.nomoredomains.club",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new ForbiddenError("Доступ к ресурсу запрещён"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(helmet());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(requestLogger);
app.use(limiter);
app.use(router);

app.use(errorLogger);

app.use(errors());

app.use("*", () => {
  throw new NotFoundError("Не найден данный ресурс");
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log("Сервер запущен");
});
