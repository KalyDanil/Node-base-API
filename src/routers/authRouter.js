const express = require("express");
const authController = require("../controllers/authController");
const authorizationRouter = express.Router();

authorizationRouter.post('/registration', authController.registration);

authorizationRouter.get('/authorization', authController.authorization);

authorizationRouter.get('/authorizationByToken', authController.authorizationByToken);

module.exports = authorizationRouter;
