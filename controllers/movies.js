const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

const Movie = require("../models/movie");

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      if (movies.length === 0) {
        res.send({ message:"Еще нет сохранённых фильмов" });
        return;
      }
      res.send(movies);
    })
    .catch(next);
};

module.exports.createNewMovie = (req, res, next) => {

  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;
  Movie.create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner: req.user._id })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("Переданы некорректные данные");
      }
    })
    .catch(next);
};

module.exports.deleteMovie= (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError("Нет карточки с данным id");
      } else  if (movie.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError("Недостаточно прав");
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then((deletedMovie) => res.send(deletedMovie))
        .catch(next);
    }).catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Невалидный id");
      } else next(err);
    })
    .catch(next);
};