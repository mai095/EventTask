import { Router } from "express";
import isAuthenticated from "../../middleweres/authentication.js";
import { validation } from "../../middleweres/validation.js";
import * as taskSchema from "./task.schema.js";
import * as taskController from "./task.controller.js";
import catchError from "../../middleweres/catchError.js";
const taskRouter = new Router();

// *addTask
taskRouter.post(
  "/addTask",
  isAuthenticated,
  validation(taskSchema.addTask),
  catchError(taskController.addTask)
);

// *updateTask
taskRouter.patch(
  "/updateTask/:taskId",
  isAuthenticated,
  validation(taskSchema.updateTask),
  catchError(taskController.updateTask)
);

// *deleteTask
taskRouter.delete(
  "/deleteTask/:taskId",
  isAuthenticated,
  validation(taskSchema.deleteTask),
  catchError(taskController.deleteTask)
);

// *getTasks
taskRouter.get("/getTasks",catchError(taskController.getTasks));

export default taskRouter;
