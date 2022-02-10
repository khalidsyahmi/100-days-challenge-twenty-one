const express = require("express");
//const bcrypt = require("bcryptjs"); 
//const mongodb = require("mongodb");

//const db = require("../data/database");
//import class Post
//const Post = require('../models/post');
const blogControllers = require("../controllers/p-contr");
const routeGuard = require('../middleware/route-guard-mw');

//const ObjectId = mongodb.ObjectId;
const router = express.Router();

router.get("/", blogControllers.getHomeKey);
//guard here
router.use(routeGuard);

router.get("/admin", blogControllers.getAdminKey);

router.post("/posts", blogControllers.createPostKey);

router.get("/posts/:id/edit", blogControllers.fetchOnePostKey);

router.post("/posts/:id/edit", blogControllers.updateOnePostKey);

router.post("/posts/:id/delete", blogControllers.deletePostKey);

module.exports = router;
