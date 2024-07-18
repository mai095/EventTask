import joi from "joi";
import { validationObjectID } from "../../middleweres/validation.js";

// *addTask
export const addTask = joi
  .object({
    // title: joi.string().min(3).max(12).required(),
    // taskBody: joi.string().min(3).max(300).required(),

    
    shared: joi.string().valid("public", "private"),
    categoryName: joi.string(),
    taskType: joi.string().valid("text", "list"),
    task: joi.array().items().required(),
  })
  .required();

// *updateTask
export const updateTask = joi
  .object({
    title: joi.string().min(3).max(12),
    taskBody: joi.string().min(3).max(300),
    shared: joi.string().valid("public", "private"),
    taskType: joi.string().valid("text", "list"),
    taskId: joi.custom(validationObjectID).required(),
    items: joi.string(),
    // listItems:joi.array().items(joi.string())
  })
  .required();

// *deleteTask
export const deleteTask = joi
  .object({
    taskId: joi.custom(validationObjectID).required(),
  })
  .required();
