import { Coupon } from "../../../generated/prisma/client";
import prisma from "../../../utils/prisma";
import AppError from "../../error/AppError";
import calculateCouponDiscount from "./coupon.engine";
import couponValidator from "./coupon.validator";

const applyCouponService = async (payload: any) => {
  const { couponCode, userId, cartItems } = payload;

  const cartTotal = cartItems.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0,
  );

  const cartShopId = cartItems[0].shopId; 

  const validateCoupon = await couponValidator({
    couponCode: couponCode,
    userId,
    cartTotal,
    cartShopId
  });
  const discount = await calculateCouponDiscount(couponCode, cartTotal);

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
 
const getAllActiveCoupons = async () => {
  return prisma.coupon.findMany({
    where: {
      isActive: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() },
    },
    include: {
      benefits: true,
      rules: true,
    },
  });
};  

// const getVendorCouponAp= async(email:string)=>{
//     const user= await prisma.user.findUnique({
//       where:{
//          email
//       },
//       include:{
//          shop:{
//             include:{
//                product:true,
//                coupons:true,
//                shopFollower:true
//             }
//          },
        
          
//       }
//     })
//     if(!user?.shop) throw new AppError(404,'Shop not fount');
    
// }

export const CouponServices = {
  applyCouponService,
  createVendorCoupon,
  getAllActiveCoupons
};
