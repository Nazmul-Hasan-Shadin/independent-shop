import { z } from "zod";

const createCouponSchema = z.object({
  code: z.string().min(3),
  title: z.string().min(3),
  description: z.string().optional,
  scope: z.enum(["CART", "PRODUCT", "SHIPPING"]),

  startDate: z.string(),
  endDate: z.string(),

  maxUsage: z.number().optional(),
  maxUsagePerUser: z.number().optional(),

  benefit: z.object({
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    value: z.number(),
  }),
});

export const CouponSchemaValidation = {
  createCouponSchema,
};
