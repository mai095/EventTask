import { model, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "userName is too short"],
      maxLength: [10, "userName is too long"],
      trim: true,
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    age: { type: Number, required: true, min: 18, max: 99 },
    phone: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], lowercase: true },
    password: {
      type: String,
      required: true,
      min: [5, "Password is too short"],
      max: [15, "Password is too long"],
    },
    isConfirmed: { type: Boolean, default: false },
    forgetCode: String,
    categories: [{ type: Types.ObjectId, ref: "Category", required: true }],
  },
  { timestamps: true }
);

// ~pre hooks
// userSchema.pre("save", function () {
//   if (this.isModified("password")) {
//     this.password = bcrypt.hashSync(
//       this.password,
//       parseInt(process.env.SALT_ROUND)
//     );
//   }
// });

export const userModel = model("User", userSchema);
