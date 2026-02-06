import express from "express";
import auth from "../Auth/auth";
import { Role } from "../../../generated/prisma/enums";
import { ReviewController } from "./review.controller";
import { ProductController } from "../product/product.controller";

const router = express.Router();

router.post(
  "/",
  auth(Role.user, Role.admin, Role.vendor),
  ReviewController.addReview
);
router.get("/my-review",auth('user'), ReviewController.myReview);
router.get("/:productId", ReviewController.getProductWithReview);


export const ReviewRoutes = router;
