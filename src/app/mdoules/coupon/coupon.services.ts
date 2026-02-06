import { Coupon } from "../../../generated/prisma/client";
import prisma from "../../../utils/prisma";
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
  const discount = await calculateCouponDiscount(code, cartTotal);

  return {
    cartTotal,
    discount,
    finalTotal: cartTotal - discount,
    validateCoupon,
  };
};

const createVendorCoupon = async (email: string, payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
    include: {
      shop: true,
    },
  });

  const shop = user?.shop;

  if (!shop) {
    throw new Error("Vendor shop not found");
  }

  const createCoupon = await prisma.$transaction(async (transaction) => {
    const createCoupon = await transaction.coupon.create({
      data: {
        code: payload.code,
        title: payload.title,
        description: payload.description,
        type: "VENDOR",
        scope: payload.scope,
        startDate: payload.startDate,
        endDate: payload.endDate,
        isActive: true,
        vendorId: user.shop?.id,
        maxUsage: payload.maxUsage,
        maxUsagePerUser: payload.maxUsagePerUser,

        priority: payload.priority,
      },
    });

    if (payload.rules) {
      await transaction.couponRule.create({
        data: {
          couponId: createCoupon.id,
          ...payload.rules,
        },
      });
    }
    if (payload.benefit) {
      await transaction.couponBenefit.create({
        data: {
          couponId: createCoupon.id,
          ...payload.benefit,
        },
      });
    }

    return createCoupon;
  });
 return createCoupon;
};
 
 

export const CouponServices = {
  applyCouponService,
  createVendorCoupon,
};
