import prisma from "../../../utils/prisma";
import AppError from "../../error/AppError";

const couponValidator = async (payload: {
  couponCode: string;
  userId: string;
  cartTotal: number;
}) => {
  const isCouponExist = await prisma.coupon.findUnique({
    where: {
      code: payload.couponCode,
    },
    include: {
      rules: true,
      benefits: true,
      usages: true,
    },
  });
  if (!isCouponExist) throw new AppError(404, "Coupon not found");
  if (!isCouponExist.isActive) throw new AppError(400, "Coupon inactive");
  const now = new Date()
  if (isCouponExist.startDate> now || isCouponExist.endDate <now) {
    throw new AppError(400, "Coupon expired")
  }
       // Global usage check
  if (
    isCouponExist.maxUsage &&
    isCouponExist.totalUsageCount >= isCouponExist.maxUsage
  ) {
    throw new AppError(400, "Coupon usage limit reached")
  }
//    =========user usage check =====
 const userUsed= await isCouponExist.usages.filter((u)=>u.userId===payload.userId).length;

  if (isCouponExist.maxUsagePerUser && userUsed >=isCouponExist.maxUsagePerUser) {
      throw new AppError(400, "User limit exceeded")
  }

  const rule=isCouponExist.rules[0];
  if (rule?.minPurchase && payload.cartTotal < rule.minPurchase) {
    throw new AppError(400, "Minimum purchase not met")
  }
  return isCouponExist
};
export default couponValidator;
