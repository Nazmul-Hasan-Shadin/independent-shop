import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AuthServices } from "../Auth/auth.services";
import { CategoryServices } from "./categroy.services";

const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.createCategory(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category is created succesful",
    data: result,
  });
});

const getCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.getCategory();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category are retrived succesful",
    data: result,
  });
});
const getCategoryById = catchAsync(async (req, res) => {
  const result = await CategoryServices.getCategoryById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category is retrived succesful",
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;

  const updatedCategory = await CategoryServices.updateCategory(categoryId as string, {
    name,
    description,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category updated successfully",
    data: updatedCategory,
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const categoryId = req.params.categoryId as string;

  const result = await CategoryServices.deleteCategory(categoryId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
};
