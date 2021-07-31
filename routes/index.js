const router = require('express').Router();

const { login, register } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const usersRoutes = require("./users");
const movieRoutes  =require("./movies");

router.post("/signup", register);
router.post("/signin", login);


router.use(auth, usersRoutes);
router.use(auth, movieRoutes);

module.exports = router;