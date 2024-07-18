import categoryModel from "../../../DB/models/category.model.js";
import taskModel from "../../../DB/models/task.model.js";
import { userModel } from "../../../DB/models/user.model.js";



// // *addTask
export const addTask = async (req, res, next) => {
  const user = await userModel.findById(req.userData._id);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  const newTask = await taskModel.create({
    ...req.body,
    createdBy: user._id,
  });

  if (req.body.categoryName) {
    const category = await categoryModel.findOne({
      categoryName: req.body.categoryName,
    });
    if (!category) return next(new Error("categoryName not found"));

    category.tasks.push(newTask);
    await category.save();
  }
  return res.json({
    success: true,
    message: "Task Created Successfully!",
    newTask,
  });
};

// *updateTask
export const updateTask = async (req, res, next) => {
  //get task
  const task = await taskModel.findById(req.params.taskId);
  if (!task) return next(new Error("Task not found", { cause: 404 }));

  //check owner
  if (req.userData._id.toString() !== task.createdBy.toString())
    return next(new Error("Not allow to change it", { cause: 403 }));

  //update
  task.title = req.body.title ? req.body.title : task.title;
  task.taskBody = req.body.taskBody ? req.body.taskBody : task.taskBody;
  task.private = req.body.private ? req.body.private : task.private;

  await task.save();

  return res.json({
    success: true,
    message: "Task Updated Successfully",
    task,
  });
};

// *deleteTask
export const deleteTask = async (req, res, next) => {
  //get task
  const task = await taskModel.findById(req.params.taskId);
  if (!task) return next(new Error("Task not found", { cause: 404 }));

  //check owner
  if (req.userData._id.toString() !== task.createdBy.toString())
    return next(new Error("Not allow to change it", { cause: 403 }));

  await taskModel.findByIdAndDelete(req.params.taskId, { new: true });

  return res.json({
    success: true,
    message: "Task Deleted Successfully",
    task,
  });
};

// *getTasks
export const getTasks = async (req, res, next) => {
  if (req.query.userId) {
    const { page, keyword } = req.query;
    const tasks = await taskModel
      .find({ createdBy: req.query.userId })
      .search(keyword)
      .pagenation(page);

    return res.json({ tasks });
  } else {
    const { page, keyword } = req.query;
    const tasks = await taskModel
      .find({ shared: "public" })
      .search(keyword)
      .pagenation(page);

    return res.json({ tasks });
  }
};
