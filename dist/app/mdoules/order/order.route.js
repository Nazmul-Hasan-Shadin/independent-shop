"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const enums_1 = require("../../../generated/prisma/enums");
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../Auth/auth"));
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(enums_1.Role.admin, enums_1.Role.vendor, enums_1.Role.user), order_controller_1.OrderController.getAllOrders);
router.get("/:id", order_controller_1.OrderController.getOrderById);
router.post("/", order_controller_1.OrderController.createOrder);
exports.OrderRoutes = router;
