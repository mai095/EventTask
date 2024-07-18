import categoryModel from "../../../DB/models/category.model.js";
import { userModel } from "../../../DB/models/user.model.js";

// &addcategory
export const addcategory = async (req, res, next) => {
  const user = await userModel.findById(req.userData._id);
  if (!user) return next(new Error("User not found", { cause: 404 }));

  const categoryName = await categoryModel.findOne({
    categoryName: req.body.categoryName,
  });
  if (categoryName) return next(new Error("categoryName is already exist"));

  const category = await categoryModel.create({
    categoryName: req.body.categoryName,
    createdBy: user._id,
  });

  user.categories.push(category._id);
  await user.save();

  return res.json({
    success: true,
    message: "Category Created Successfully!",
    category,
  });
};

// &updateCategory
export const updateCategory = async (req, res, next) => {
  //get task
  const category = await categoryModel.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found", { cause: 404 }));

  //check owner
  if (req.userData._id.toString() !== category.createdBy.toString())
    return next(new Error("Not allow to change it", { cause: 403 }));

  //update
  category.categoryName = req.body.categoryName
    ? req.body.categoryName
    : category.categoryName;
  await category.save();

  return res.json({
    success: true,
    message: "Category Updated Successfully",
    category,
  });
};

// &deleteCategory
export const deleteCategory = async (req, res, next) => {
  //get task
  const category = await categoryModel.findById(req.params.categoryId);
  if (!category) return next(new Error("Category not found", { cause: 404 }));

  //check owner
  if (req.userData._id.toString() !== category.createdBy.toString())
    return next(new Error("Not allow to change it", { cause: 403 }));

  //delete
  await categoryModel.findByIdAndDelete(req.params.categoryId, { new: true });

  req.userData.categories.pull(req.params.categoryId);
  await req.userData.save();
  return res.json({
    success: true,
    message: "Category Deleted Successfully",
    category,
  });
};

// &getCategories
export const getCategories = async (req, res, next) => {
  const categories = await categoryModel
    .find({ createdBy: req.userData._id })
    .populate([{ path: "tasks", select: "title -_id" }]);
  return res.json({ categories });
};
