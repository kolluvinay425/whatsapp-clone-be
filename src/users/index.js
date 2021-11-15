import express from "express";
import userModel from "./schema.js";
import CreateHttpError from "http-errors";
import JWtAuthenticateMiddle from "./authentication/jwt.js";
import { JWtAuthenticate } from "./authentication/tools.js";
import createHttpError from "http-errors";
const userRouter = express.Router();

userRouter.post("/account", async (req, res, next) => {
  try {
    const register = new userModel(req.body);
    const saveUser = await register.save();
    res.send({ saveUser });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.checkCredentials(email, password);
    if (user) {
      const { accessToken, refreshToken } = await JWtAuthenticate(user);
      res.send({ accessToken, refreshToken });
    } else {
      next(
        createHttpError(401, "cridentials are not ok check again correctly")
      );
    }
  } catch (error) {
    next(error);
  }
});
userRouter.get("/", JWtAuthenticateMiddle, async (req, res, next) => {
  console.log(req.user);
  try {
    const users = await userModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});
export default userRouter;
