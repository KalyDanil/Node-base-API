const express = require("express");
const urlencodedParser = express.urlencoded({extended: true});
const userController = require("../controllers/userController");
const userRouter = express.Router();

userRouter.use('/', urlencodedParser, userController.tokenVerify);

userRouter.put('/edit', urlencodedParser, userController.edit);

userRouter.delete('/delete', urlencodedParser, userController.delete);

module.exports = userRouter;