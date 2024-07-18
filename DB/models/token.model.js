import { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema(
  {
    token: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    isValid: { type: Boolean, default: true },
  },
  { timestamps: true }
);



export const tokenModel = model("Token", tokenSchema);
