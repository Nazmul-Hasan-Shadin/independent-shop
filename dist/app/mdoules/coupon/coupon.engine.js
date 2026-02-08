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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCouponDiscount = void 0;
const client_1 = require("../../../generated/prisma/client");
const calculateCouponDiscount = (coupon, cartTotal) => __awaiter(void 0, void 0, void 0, function* () {
    const benefit = coupon.benefits[0];
    let discount = 0;
    if (benefit.discountType === client_1.DiscountType.PERCENTAGE) {
        discount = (cartTotal * benefit.value) / 100;
    }
    if (benefit.discountType === client_1.DiscountType.FIXED) {
        discount = benefit.value;
    }
    if (benefit.maxDiscount && discount > benefit.maxDiscount) {
        discount = benefit.maxDiscount;
    }
    return discount;
});
exports.calculateCouponDiscount = calculateCouponDiscount;
exports.default = exports.calculateCouponDiscount;
