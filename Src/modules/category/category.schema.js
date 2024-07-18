import joi from 'joi'
import { validationObjectID } from '../../middleweres/validation.js';

// *addcategory
export const addcategory = joi
  .object({
    categoryName: joi.string().min(3).max(20).trim().required(),
  })
  .required();

  // *updateCategory
export const updateCategory = joi
  .object({
    categoryName: joi.string().min(3).max(20).trim(),
    categoryId:joi.string().custom(validationObjectID).required()
  })
  .required();

  // *updateCategory
export const deleteCategory = joi
  .object({
    categoryId:joi.string().custom(validationObjectID).required()
  })
  .required();
