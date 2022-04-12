const express = require("express");
const userController = require("../controllers/userController");
const tokenVerify = require("../controllers/tokenVerify");
const userRouter = express.Router();

userRouter.put('/edit', tokenVerify, userController.edit);

userRouter.delete('/delete', tokenVerify, userController.delet);

module.exports = userRouter;