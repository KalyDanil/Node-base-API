const express = require("express");
const urlencodedParser = express.urlencoded({extended: true});
const authController = require("../controllers/authController");
const authorizationRouter = express.Router();

authorizationRouter.post('/registration', urlencodedParser, authController.registration);

authorizationRouter.get('/authorization', urlencodedParser, authController.authorization);

authorizationRouter.get('/authorizationByToken', urlencodedParser, authController.authorizationByToken);

module.exports = authorizationRouter;
