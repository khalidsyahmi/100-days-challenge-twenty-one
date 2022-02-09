const express = require("express");
//const bcrypt = require("bcryptjs");
//const mongodb = require("mongodb");
//const db = require("../data/database");

//const User = require('../models/user');
const authController = require('../controllers/a-contr');

/* const ObjectId = mongodb.ObjectId; */
const router = express.Router();

router.get("/signup", authController.getSignUpK);

router.get("/login", authController.getSignInK);

router.post("/signup", authController.createAccountK);

router.post("/login", authController.logOnK);

router.post("/logout", authController.logOutK);

module.exports = router;
