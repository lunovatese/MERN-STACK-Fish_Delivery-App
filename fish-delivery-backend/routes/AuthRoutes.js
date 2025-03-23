const express = require("express");

const AuthController = require("../controllers/AuthController.js");
const router = express.Router();

//user Registration
router.post("/register", AuthController.registerNewUser);

//user login
router.post("/login", AuthController.userLogin);

module.exports = router;
