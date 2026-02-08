"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const couponValidator = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('paylodd utrte', payload);
    const coupon = yield prisma_1.default.coupon.findUnique({
        where: { code: payload.couponCode },
        include: {
            rules: { select: { minPurchase: true } },
            benefits: true
        }
    });
    if (!coupon)
        throw new AppError_1.default(404, "Coupon not found");
    if (!coupon.isActive)
        throw new AppError_1.default(400, "Coupon inactive");
    const now = new Date();
    if (coupon.startDate > now || coupon.endDate < now)
        throw new AppError_1.default(400, "Coupon expired");
    console.log(coupon.vendorId, payload.cartShopId);
    //  Vendor Scope Validation
    if (coupon.type === "VENDOR") {
        if (coupon.vendorId !== payload.cartShopId) {
            throw new AppError_1.default(400, "Coupon not valid for this vendor");
        }
    }
    // Global Usage Limit
    if (coupon.maxUsage) {
        const totalUsed = yield prisma_1.default.couponUsage.count({
            where: { couponId: coupon.id }
        });
        if (totalUsed >= coupon.maxUsage)
            throw new AppError_1.default(400, "Coupon usage limit reached");
    }
    //  User Usage Limit
    if (coupon.maxUsagePerUser) {
        const userUsed = yield prisma_1.default.couponUsage.count({
            where: {
                couponId: coupon.id,
                userId: payload.userId
            }
        });
        if (userUsed >= coupon.maxUsagePerUser)
            throw new AppError_1.default(400, "User usage limit exceeded");
    }
    //  Business Rules
    const rule = (_a = coupon.rules) === null || _a === void 0 ? void 0 : _a[0];
    if ((rule === null || rule === void 0 ? void 0 : rule.minPurchase) && payload.cartTotal < rule.minPurchase)
        throw new AppError_1.default(400, "Minimum purchase not met");
    return coupon;
});
exports.default = couponValidator;
// to do
//  Next enterprise upgrade (future)
// ✔ coupon stacking validation
// ✔ vendor scope validation
// ✔ category scope validation
// ✔ product scope validation
// ✔ multi coupon priority engine
