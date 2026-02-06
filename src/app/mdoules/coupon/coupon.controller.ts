import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { CouponServices } from "./coupon.services";

export const applyCouponController = catchAsync(async (req, res, next) => {
  const result = await CouponServices.applyCouponService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Coupon applied",
    data: result,
  });
});

const createVendorCoupon = catchAsync(async (req, res, next) => {
  const result = await CouponServices.createVendorCoupon(req.user.email,req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Coupon has created",
    data: result,
  });
});
export const ApplyCouponController = {
  applyCouponController,
  createVendorCoupon,
};
