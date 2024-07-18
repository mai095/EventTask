import { Router } from "express";
import { validation } from "../../middleweres/validation.js";
import * as userSchema from './user.schema.js'
import * as userController from './user.controller.js'
import catchError from "../../middleweres/catchError.js";
import isAuthenticated from "../../middleweres/authentication.js";

const userRouter = new Router();


// *forgetCode
userRouter.patch(
    "/forgetCode",
    validation(userSchema.forgetCode),
    catchError(userController.forgetCode)
  );
  

// *resetPass
userRouter.patch(
    "/resetPass",
    validation(userSchema.resetPass),
    catchError(userController.resetPass)
  );

// *updatePass
userRouter.put(
    "/updatePass",
    isAuthenticated,
    validation(userSchema.updatePassSchema),
    catchError(userController.updatePass)
  );

// *delete user


// *getdata
userRouter.get(
    "/getData/:id",
    isAuthenticated,
    validation(userSchema.userIdSchema),
    catchError(userController.getUserData)
  );

export default userRouter;
