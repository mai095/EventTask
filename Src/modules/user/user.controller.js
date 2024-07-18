import { userModel } from "../../../DB/models/user.model.js";
import Randomstring from "randomstring";
import sendEmail from "../../utilis/sendEmail.js";
import { tokenModel } from "../../../DB/models/token.model.js";
import { resetPassTemp } from "../../utilis/htmlTemplete.js";
import bcrypt from "bcryptjs";

// &forgetCode
export const forgetCode = async (req, res, next) => {
  //check email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new Error("Email not found"));
  if (!user.isConfirmed) return next(new Error("Activate your account first!"));
  //generate code
  const restCode = Randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  const html = resetPassTemp(restCode);
  //send code
  await sendEmail({
    to: user.email,
    subject: "Forget Code",
    html,
  });

  //update forgetCode
  user.forgetCode = restCode;
  await user.save();
  //res
  return res.json({
    success: true,
    message: "Check your Email",
  });
};

// &resetPass
export const resetPass = async (req, res, next) => {
  //check email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new Error("Email not found"));
  if (!user.isConfirmed) return next(new Error("Activate your account first!"));

  //compare code  db with body
  if (req.body.forgetCode !== user.forgetCode)
    return next(new Error("Invalid Code", { cause: 400 }));

  //hash pass
  user.password = bcrypt.hashSync(
    req.body.newPassword,
    parseInt(process.env.SALT_ROUND)
  );

  await user.save();

  //update forgetCode
  await userModel.findByIdAndUpdate(
    user._id,
    { $unset: { forgetCode: 1 } },
    { new: true }
  );

  //logout
  const tokens = await tokenModel.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  //res
  return res.json({
    success: true,
    message: "You can login again with new password",
  });
};

// &UpdatePassword
export const updatePass = async (req, res, next) => {
  //check email
  const user = await userModel.findOne({ email: req.userData.email });
  if (!user) return next(new Error("User not Found", { cause: 404 }));

  //check oldPass==userPass
  if (!bcrypt.compareSync(req.body.oldPassword, user.password))
    return next(
      new Error("Wrong Password,you not allowed to change password", {
        cause: 403,
      })
    );

  //hash newPass
  const hashPass = bcrypt.hashSync(
    req.body.newPassword,
    parseInt(process.env.SALT_ROUND)
  );

  //update DB &save
  user.password = hashPass;
  await user.save();

  //logOut
  const tokens = await tokenModel.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  //res
  return res.json({
    success: true,
    message:
      "Account password updated successfully, try to login again with new password",
  });
};

// &get
export const getUserData = async (req, res, next) => {
  // check user
  const user = await userModel.findById(req.params.id);
  if (!user) return next(new Error("User not Found", { cause: 404 }));

  //check owner
  if (user._id.toString() !== req.userData._id.toString())
    return next(
      new Error("Not allowed to get data of this account", { cause: 403 })
    );
  // get data
  const results = await userModel.findById(user._id).populate([
    {
      path: "categories",
      select: "categoryName",
      populate: { path: "tasks", select: "title" },
    },
  ]);
  return res.json({
    success: true,
    results,
  });
};
