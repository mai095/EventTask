import joi from "joi";

// ^register
export const register = joi
  .object({
    name: joi.string().min(3).max(10).trim().required(),
    email: joi
      .string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: joi
      .string()
      .required()
      .min(5)
      .max(15)
      .pattern(new RegExp("[A-Za-z0-9]{5,8}")),
    confirmPassword: joi.string().required().valid(joi.ref("password")),
    age: joi.number().required().min(18).max(99).message({
      "number.min": "Age must be between 18 and 99",
      "number.max": "Age must be between 18 and 99",
    }),
    gender: joi.string(),
    phone: joi.string().required(),
  })
  .required();

  
// ^activation
export const activation = joi
.object({
  token: joi.string().required(),
})
.required();

// ^logIn
export const login = joi
  .object({
    email: joi
      .string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: joi
      .string()
      .required()
      .min(5)
      .max(15)
      .pattern(new RegExp("[A-Za-z0-9]{5,8}")),
  })
  .required();
