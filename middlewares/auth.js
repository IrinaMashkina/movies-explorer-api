const UnauthorizedError = require("../errors/unauthorized-err");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, NODE_ENV } = process.env;

module.exports.auth = (req, res, next) => {
  // const { authorization } = req.headers;
  // console.log(authorization)

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  // throw new UnauthorizedError('Необходима авторизация');
  // }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};