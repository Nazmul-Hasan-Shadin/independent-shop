import express from "express";

import { Role } from "../../../generated/prisma/enums";
import { OrderController } from "./order.controller";
import auth from "../Auth/auth";

const router = express.Router();

router.get(
  "/",
  auth(Role.admin, Role.vendor, Role.user),
  OrderController.getAllOrders
);
router.get("/:id", OrderController.getOrderById);

router.post("/", OrderController.createOrder);

export const OrderRoutes = router;
