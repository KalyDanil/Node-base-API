const express = require("express");
const app = express();
const authorizationRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");

app.use("/auth", authorizationRouter);
app.use("/user", userRouter);

app.listen(3000);