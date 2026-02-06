import express, { NextFunction, Request, Response } from "express";
import { ProductController } from "./product.controller";
import { fileUpload } from "../../../utils/fileUploader";
import auth from "../Auth/auth";
import { Role } from "../../../generated/prisma/enums"; 

const router = express();
router.get("/", ProductController.getAllProduct);
router.get("/:id", auth(),ProductController.getSingleProduct);
router.get("/shop/products/:shopId", ProductController.getProductByShopId);

router.post(
  "/create-product",
  fileUpload.multerUpload.array("files"),
  (req: Request, res: Response, next: NextFunction) => {
    (req.body = JSON.parse(req.body.data)),
      ProductController.createProductIntoDb(req, res, next);
  }
);

router.post("/:id/view", ProductController.incrementProductViewCOunt);

router.get("/user/following/products",auth(Role.user), ProductController.getFollowedShopProduct);

router.patch("/:id", auth(Role.admin,Role.vendor),ProductController.updateProduct);
router.delete("/:id", auth(Role.admin,Role.vendor),ProductController.deleteProduct);



export const ProductRoutes = router;
