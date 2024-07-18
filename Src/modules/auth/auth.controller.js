import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userModel } from "../../../DB/models/user.model.js";
import { tokenModel } from "../../../DB/models/token.model.js";
import sendEmail from "../../utilis/sendEmail.js";
import { signUpTemp } from "../../utilis/htmlTemplete.js";

// ^register
export const register = async (req, res, next) => {
  //check email
  const isExist = await userModel.findOne({ email: req.body.email });
  if (isExist) return next(new Error("Email already exist", { cause: 400 }));

  //check confirm password
  if (req.body.password !== req.body.confirmPassword)
    return next(new Error("Confirm password is not matched", { cause: 409 }));

  //hash pass
  const hashPass = bcrypt.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );
  //create user
  const user = await userModel.create({ ...req.body, password: hashPass });

  //create token in DB
  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.SECRET_KEY
  );

  //activation
  const html = signUpTemp(
    `http://localhost:3000/api/v1/auth/activation/${token}`
  );
  const confirmMsg = await sendEmail({
    to: user.email,
    subject: "Account Activation",
    html,
  });
  if (!confirmMsg) return next(new Error("Invalid Email", { cause: 404 }));

  //res
  return res.json({ success: true, message: "Check you email for activation" });
};

// ^activation
export const activation = async (req, res, next) => {
  //check token
  const token = req.params.token;
  if (!token) return next(new Error("Invalid URL", { cause: 404 }));
  //decode token
  const payload = jwt.verify(token, process.env.SECRET_KEY);
  //update user
  const user = await userModel.findOneAndUpdate(
    { email: payload.email },
    { isConfirmed: true },
    { new: true }
  );
  await user.save();
  //res
  user && res.json({ success: true, message: "You can login now" });
  !user &&
    res.json({
      success: false,
      message: next(new Error("User not found", { cause: 404 })),
    });
};

// ^login
export const login = async (req, res, next) => {
  //check email in Db
  const user = await userModel.findOne({
    email: req.body.email,
  });

  if (!user)
    return next(
      new Error("Email not found,try to signUp first!", { cause: 409 })
    );

  //check password
  if (!bcrypt.compareSync(req.body.password, user.password))
    return next(new Error("Wrong password", { cause: 400 }));

  //check confirmation
  if (!user.isConfirmed)
    return next(new Error("Confirm you email first", { cause: 403 }));

  //create token in Db
  const token = jwt.sign(
    { email: user.email, _id: user._id },
    process.env.SECRET_KEY
  );
  await tokenModel.create({
    token,
    user: user._id,
    agent: req.headers["agent"],
  });
  //res
  return res.json({ success: true, token });
};
