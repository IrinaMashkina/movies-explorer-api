require('dotenv').config();

const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

const { PORT = 3000 } = process.env;
app.use(cors());

mongoose.connect("mongodb://localhost:27017//bitfilmsdb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => console.log("Mongodb connected"));
mongoose.connection.on("error", (err) => console.log(`Ошибка ${err}`));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(PORT, () => {
  console.log("Сервер запущен");
});
