import express from "express";
import { ApplyCouponController } from "./coupon.controller";

const router= express.Router()

router.post('/apply',ApplyCouponController.applyCouponController)
export const CouponRoutes= router