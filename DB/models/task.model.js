import { Schema, Types, model } from "mongoose";

const taskSchema = new Schema(
  {
    // title: {
    //   type: String,
    //   minLength: [3, "Task title is too short"],
    //   maxLength: [12, "Task title is too long"],
    //   require: true,
    // },
    taskBody: { type: String, minLength: 3, maxLength: 300 },
    task: [{ item: String, body: { type: String, required: true } }],
    shared: { type: String, enum: ["public", "private"], default: "public" },
    createdBy: { type: Types.ObjectId, ref: "User" },
    categoryName: { type: String },
    taskType: { type: String, enum: ["text", "list"], default: "text" },
  },
  { timestamps: true, strictQuery: true }
);

// ~query helper ==> pagenation
taskSchema.query.pagenation = function (page) {
  page = page < 1 || isNaN(page) || !page ? 1 : page;
  const limit = 2;
  const skip = limit * (page - 1);
  return this.find().limit(limit).skip(skip);
};

// ~query helper ==> search
taskSchema.query.search = function (keyword) {
  if (keyword) {
    return this.find({
      categoryName: { $regex: keyword, $options: "i" },
    });
  }
  return this;
};
const taskModel = model("Task", taskSchema);
export default taskModel;
