import { User } from "../../../generated/prisma/client";
import prisma from "../../../utils/prisma";
import bcrypt from "bcrypt";
import { Request } from "express";

const createCategory = async (req: Request) => {
  if (req.file) {
    req.body.images = req?.file.path;
  }

  const result = prisma.category.create({
    data: {
      ...req.body,
    },
  });

  return result;
};

const getCategory = async () => {
  const result = prisma.category.findMany({});

  return result;
};
const getCategoryById = async (categoryId: string) => {
  const result = prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  return result;
};
const updateCategory = async (
  categoryId: string,
  data: { name: string; description: string }
) => {
  const updatedCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data,
  });

  return updatedCategory;
};

const deleteCategory = async (categoryId: string) => {
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
    
  });

  return { message: "Category deleted successfully" };
};

export const CategoryServices = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
};
