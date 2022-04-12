const express = require("express");
const authController = require("../controllers/authController");
const tokenVerify = require("../controllers/tokenVerify");
const authorizationRouter = express.Router();

authorizationRouter.post('/registration', authController.registration);

authorizationRouter.get('/authorization', authController.authorization);

authorizationRouter.get('/authorizationByToken', tokenVerify, authController.authorizationByToken);

module.exports = authorizationRouter;
