import prisma from "../../../utils/prisma";
import AppError from "../../error/AppError";

const couponValidator = async (payload: {
  couponCode: string;
  userId: string;
  cartTotal: number;
  cartShopId: string;
}) => {
  console.log('paylodd utrte',payload);
  
  const coupon = await prisma.coupon.findUnique({
    where: { code: payload.couponCode },
    include: {
      rules: { select: { minPurchase: true } },
      benefits: true
    }
  });

  if (!coupon)
    throw new AppError(404, "Coupon not found");

  if (!coupon.isActive)
    throw new AppError(400, "Coupon inactive");

  const now = new Date();

  if (coupon.startDate > now || coupon.endDate < now)
    throw new AppError(400, "Coupon expired");

  console.log(coupon.vendorId,payload.cartShopId);
  
  //  Vendor Scope Validation
  if (coupon.type === "VENDOR") {
    if (coupon.vendorId !== payload.cartShopId) {
       
      throw new AppError(400, "Coupon not valid for this vendor");
    }
  }

  // Global Usage Limit
  if (coupon.maxUsage) {
    const totalUsed = await prisma.couponUsage.count({
      where: { couponId: coupon.id }
    });

    if (totalUsed >= coupon.maxUsage)
      throw new AppError(400, "Coupon usage limit reached");
  }

  //  User Usage Limit
  if (coupon.maxUsagePerUser) {
    const userUsed = await prisma.couponUsage.count({
      where: {
        couponId: coupon.id,
        userId: payload.userId
      }
    });

    if (userUsed >= coupon.maxUsagePerUser)
      throw new AppError(400, "User usage limit exceeded");
  }

  //  Business Rules
  const rule = coupon.rules?.[0];

  if (rule?.minPurchase && payload.cartTotal < rule.minPurchase)
    throw new AppError(400, "Minimum purchase not met");

  return coupon;
};

export default couponValidator

// to do
//  Next enterprise upgrade (future)

// ✔ coupon stacking validation

// ✔ vendor scope validation

// ✔ category scope validation

// ✔ product scope validation

// ✔ multi coupon priority engine
