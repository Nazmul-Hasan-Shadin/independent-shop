"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const coupon_controller_1 = require("./coupon.controller");
const auth_1 = __importDefault(require("../Auth/auth"));
const router = express_1.default.Router();
router.get('/', coupon_controller_1.ApplyCouponController.getAllCoupon);
router.post('/apply', coupon_controller_1.ApplyCouponController.applyCouponController);
router.post('/create-coupon', (0, auth_1.default)('vendor'), coupon_controller_1.ApplyCouponController.createVendorCoupon);
exports.CouponRoutes = router;
