const usersRoutes = require('express').Router();


const {  getMyInfo, updateUser } = require('../controllers/users.js');


usersRoutes.get('/users/me', getMyInfo);

usersRoutes.patch('/users/me', updateUser);


module.exports = usersRoutes;