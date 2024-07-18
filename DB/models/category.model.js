import { model, Schema, Types } from "mongoose";

const categorySchema = new Schema({
  categoryName: {
    type: String,
    required: true,
    unique:true,
    minLength: [3, "categoryName is too short"],
    maxLength: [20, "categoryName is too long"],
    trim: true,
  },
  createdBy: { type: Types.ObjectId, ref: "User" },
  tasks:[{ type: Types.ObjectId, ref: "Task" }],
});

const categoryModel = model("Category", categorySchema);
export default categoryModel