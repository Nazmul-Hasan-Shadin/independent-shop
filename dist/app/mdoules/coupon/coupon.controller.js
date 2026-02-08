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
exports.ApplyCouponController = exports.applyCouponController = exports.getAllCoupon = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const coupon_services_1 = require("./coupon.services");
exports.getAllCoupon = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_services_1.CouponServices.getAllActiveCoupons();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Coupon are retrieved",
        data: result,
    });
}));
exports.applyCouponController = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_services_1.CouponServices.applyCouponService(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Coupon applied",
        data: result,
    });
}));
const createVendorCoupon = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_services_1.CouponServices.createVendorCoupon(req.user.email, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Coupon has created",
        data: result,
    });
}));
exports.ApplyCouponController = {
    applyCouponController: exports.applyCouponController,
    createVendorCoupon,
    getAllCoupon: exports.getAllCoupon
};
