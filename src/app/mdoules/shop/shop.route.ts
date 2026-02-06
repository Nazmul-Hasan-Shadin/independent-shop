import express, { NextFunction, Request, Response } from "express";
import { ShopController } from "./shop.controller";
import auth from "../Auth/auth";
import { Role } from "../../../generated/prisma/enums"; 
import { fileUpload } from "../../../utils/fileUploader";

const router = express();

router.get("/", ShopController.getTopTenShop);
router.get("/all-shops", auth(Role.admin),ShopController.getAllShop);

router.get("/:id", ShopController.shopById);

router.post(
  "/create-shop",
  fileUpload.multerUpload.single("file"),
  auth(Role.vendor, Role.admin),
  (req: Request, res: Response, next: NextFunction) => {
    (req.body = JSON.parse(req.body.data)),
      ShopController.createShop(req, res, next);
  }
);

export const ShopRoutes = router;
