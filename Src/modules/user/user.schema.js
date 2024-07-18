import joi from "joi";
import { validationObjectID } from "../../middleweres/validation.js";

// *forgetCode
export const forgetCode = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

// *resetPass
export const resetPass = joi
  .object({
    email: joi.string().required(),
    forgetCode: joi.string().required().length(5),
    newPassword: joi.string().required(),
    confirmPassword: joi.string().required().valid(joi.ref("newPassword")),
  })
  .required();

// *updatePassSchema
export const updatePassSchema = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
    confirmNewPassword: joi.string().required().valid(joi.ref("newPassword")),
  })
  .required();

//*userIdSchema
export const userIdSchema = joi
  .object({
    id: joi.string().custom(validationObjectID).required(),
  })
  .required();
