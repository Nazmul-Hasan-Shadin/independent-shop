import calculateCouponDiscount from "./coupon.engine";
import couponValidator from "./coupon.validator";

const applyCouponService = async (payload: any) => {
  const { code, userId, cartItems } = payload;

  const cartTotal = cartItems.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0,
  );
  const validateCoupon = await couponValidator({
    couponCode: code,
    userId,
    cartTotal,
  });
  const discount =await calculateCouponDiscount(code, cartTotal);

  return {
    cartTotal,
    discount,
    finalTotal: cartTotal - discount,
    validateCoupon,
  };
};

export const CouponServices = {
  applyCouponService,
};
