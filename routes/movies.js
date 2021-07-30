
const movieRoutes = require('express').Router();
const { getMovies, createNewMovie, deleteMovie } = require('../controllers/movies');

movieRoutes.post('/movies', createNewMovie);
movieRoutes.get('/movies', getMovies);
movieRoutes.delete('/movies/:movieId', deleteMovie);

module.exports = movieRoutes;


