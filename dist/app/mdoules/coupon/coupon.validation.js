"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponSchemaValidation = void 0;
const zod_1 = require("zod");
const createCouponSchema = zod_1.z.object({
    code: zod_1.z.string().min(3),
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().optional,
    scope: zod_1.z.enum(["CART", "PRODUCT", "SHIPPING"]),
    startDate: zod_1.z.string(),
    endDate: zod_1.z.string(),
    maxUsage: zod_1.z.number().optional(),
    maxUsagePerUser: zod_1.z.number().optional(),
    benefit: zod_1.z.object({
        discountType: zod_1.z.enum(["PERCENTAGE", "FIXED"]),
        value: zod_1.z.number(),
    }),
});
exports.CouponSchemaValidation = {
    createCouponSchema,
};
