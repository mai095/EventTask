import { Router } from "express";
import * as categoryController from "./category.controller.js";
import * as categorySchema from "./category.schema.js";
import isAuthenticated from "../../middleweres/authentication.js";
import catchError from "../../middleweres/catchError.js";
import { validation } from "../../middleweres/validation.js";
const categoryRouter = new Router();

// *addcategory
categoryRouter.post(
  "/addcategory",
  isAuthenticated,
  validation(categorySchema.addcategory),
  catchError(categoryController.addcategory)
);

// *updatecategory
categoryRouter.patch(
  "/updatecategory/:categoryId",
  isAuthenticated,
  validation(categorySchema.updateCategory),
  catchError(categoryController.updateCategory)
);
// *deleteCategory
categoryRouter.delete(
  "/deleteCategory/:categoryId",
  isAuthenticated,
  validation(categorySchema.deleteCategory),
  catchError(categoryController.deleteCategory)
);

// *getCategories
categoryRouter.get(
  "/getCategories",
  isAuthenticated,
  catchError(categoryController.getCategories)
);

export default categoryRouter;
