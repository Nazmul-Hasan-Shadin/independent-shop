import express, { NextFunction, Request, Response } from "express";
import { CategoryController } from "./category.controller";
import auth from "../Auth/auth";
import { Role } from "../../../generated/prisma/enums"; 
import { fileUpload } from "../../../utils/fileUploader";

const router = express();

router.get(
  "/",

  CategoryController.getCategory
);

router.get(
  "/:id",

  CategoryController.getCategoryById
);

router.post(
  "/create-category",
  auth(Role.admin),

  fileUpload.multerUpload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    (req.body = JSON.parse(req.body.data)), console.log(req.body.data, "bsl");

    CategoryController.createCategory(req, res, next);
  }

  // CategoryController.createCategory
);

router.put("/:categoryId", CategoryController.updateCategory);
router.delete("/:categoryId", CategoryController.deleteCategory);

export const CategoryRoutes = router;
