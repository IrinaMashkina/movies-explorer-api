const usersRoutes = require('express').Router();


const {  getMyInfo, updateUser, logout } = require('../controllers/users.js');


usersRoutes.get('/users/me', getMyInfo);

usersRoutes.patch('/users/me', updateUser);

usersRoutes.post('/signout', logout);

module.exports = usersRoutes;