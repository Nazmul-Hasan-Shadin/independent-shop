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
router.get("/item/:orderId",OrderController.getOrderItems);
router.get("/orders/items/:orderId",OrderController.getOrderItemsFORVendor);
router.post("/", OrderController.createOrder);
router.patch("/:id/status", OrderController.updateOrderStatus);


export const OrderRoutes = router;
