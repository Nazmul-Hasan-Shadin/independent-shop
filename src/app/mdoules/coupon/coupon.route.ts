import express from "express";
import { ApplyCouponController } from "./coupon.controller";
import auth from "../Auth/auth";

const router= express.Router()
router.post('/',ApplyCouponController.applyCouponController)
router.post('/apply',ApplyCouponController.applyCouponController)
router.post('/create-coupon',auth('vendor'),ApplyCouponController.createVendorCoupon)
export const CouponRoutes= router