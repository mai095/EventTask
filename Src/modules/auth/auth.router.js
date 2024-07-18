import { Router } from "express";
import * as authSchema from "./auth.schema.js";
import * as authController from "./auth.controller.js";
import catchError from "../../middleweres/catchError.js";
import { validation } from "../../middleweres/validation.js";
const authRouter = new Router();

// *signUp
authRouter.post(
  "/signUp",
  validation(authSchema.register),
  catchError(authController.register)
);

// *activation
authRouter.get(
  "/activation/:token",
  validation(authSchema.activation),
  catchError(authController.activation)
);

// *login
authRouter.post(
  "/login",
  validation(authSchema.login),
  catchError(authController.login)
);

export default authRouter;
