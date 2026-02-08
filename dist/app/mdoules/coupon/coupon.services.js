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
exports.CouponServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const coupon_engine_1 = __importDefault(require("./coupon.engine"));
const coupon_validator_1 = __importDefault(require("./coupon.validator"));
const applyCouponService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { couponCode, userId, cartItems } = payload;
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartShopId = cartItems[0].shopId;
    const validateCoupon = yield (0, coupon_validator_1.default)({
        couponCode: couponCode,
        userId,
        cartTotal,
        cartShopId,
    });
    const discount = yield (0, coupon_engine_1.default)(couponCode, cartTotal);
    return {
        cartTotal,
        discount,
        finalTotal: cartTotal - discount,
        validateCoupon,
    };
});
const createVendorCoupon = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: email },
        include: {
            shop: true,
        },
    });
    const shop = user === null || user === void 0 ? void 0 : user.shop;
    if (!shop) {
        throw new Error("Vendor shop not found");
    }
    const createCoupon = yield prisma_1.default.$transaction((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const createCoupon = yield transaction.coupon.create({
            data: {
                code: payload.code,
                title: payload.title,
                description: payload.description,
                type: "VENDOR",
                scope: payload.scope,
                startDate: payload.startDate,
                endDate: payload.endDate,
                isActive: true,
                vendorId: (_a = user.shop) === null || _a === void 0 ? void 0 : _a.id,
                maxUsage: payload.maxUsage,
                maxUsagePerUser: payload.maxUsagePerUser,
                priority: payload.priority,
            },
        });
        if (payload.rules) {
            yield transaction.couponRule.create({
                data: Object.assign({ couponId: createCoupon.id }, payload.rules),
            });
        }
        if (payload.benefit) {
            yield transaction.couponBenefit.create({
                data: Object.assign({ couponId: createCoupon.id }, payload.benefit),
            });
        }
        return createCoupon;
    }));
    return createCoupon;
});
const getAllActiveCoupons = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.coupon.findMany({
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
});
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
exports.CouponServices = {
    applyCouponService,
    createVendorCoupon,
    getAllActiveCoupons,
};
