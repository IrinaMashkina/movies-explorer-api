const User = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const DubbleError = require("../errors/dubble-err");


const { NODE_ENV, JWT_SECRET } = process.env;

const getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Нет пользователя с таким id");
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Невалидный id");
      } else next(err);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
      context: "query",
    }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("Переданы некорректные данные");
      } else if (err.name === "MongoError" || err.code === 11000) {
        throw new DubbleError("Пользователь с таким email уже зарегистрирован");
      }
      else next(err);
    })
    .catch(next);
};

const register = (req, res, next) => {

  const { name, email, password } = req.body;
  if (!password || password.length < 5) {
    throw new BadRequestError("Переданы некорректные данные");
  }
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))

    .then(({email}) => User.find({email}))
    .then((newUser) => res.send(newUser))
    .catch((err) => {

      if (err.name === "MongoError" || err.code === 11000) {
        throw new DubbleError("Пользователь с таким email уже зарегистрирован");
      } else  if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequestError("Переданы некорректные данные");
      } else  next(err);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "some-secret-key",
        {
          expiresIn: "7d",
        }
      );
      res.send({ token });
    })
    .catch(next);
};

// const logout = (req, res) => {
//   return res.clearCookie("jwt").send({ message: "Cookies успешно удалены" });
// };

module.exports = {
  getMyInfo,
  register,
  updateUser,
  login,
  // logout,
};
