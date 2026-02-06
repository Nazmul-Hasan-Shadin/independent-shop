import { Coupon, DiscountType } from "../../../generated/prisma/client";

export const calculateCouponDiscount = async (
  coupon: any,
  cartTotal: number,
) => {
  const benefit = coupon.benefits[0];
  let discount = 0;

  if (benefit.discountType === DiscountType.PERCENTAGE) {
    discount = (cartTotal * benefit.value) / 100;
  }

  if (benefit.discountType === DiscountType.FIXED) {
    discount = benefit.value;
  }

  if (benefit.maxDiscount && discount > benefit.maxDiscount) {
    discount = benefit.maxDiscount;
  }

  return discount;
};

export default calculateCouponDiscount;
