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
exports.PaymentServicesSSL = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const initPayment = (orderInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        total_amount: Number(orderInfo.price),
        currency: "BDT",
        tran_id: orderInfo.transactionId, // use unique tran_id for each api call
        success_url: `https://independent-shop.vercel.app/api/v1/payment-gate/success/${orderInfo.transactionId}`,
        // success_url: "http://localhost:3000/success-payment",
        fail_url: "http://localhost:3030/fail",
        cancel_url: "http://localhost:3030/cancel",
        ipn_url: "https://independent-shop.vercel.app/payment-gate/ipn",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: "customer@example.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
        store_id: config_1.default.payment.store_id,
        store_passwd: config_1.default.payment.store_pass,
    };
    const response = yield axios_1.default.post("https://sandbox.sslcommerz.com/gwprocess/v3/api.php", data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return {
        paymentUrl: response.data.GatewayPageURL,
    };
});
const validatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("iam called", payload);
    try {
        const response = yield (0, axios_1.default)({
            method: "GET",
            url: `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?wsdl?val_id=${payload.val_id}&store_id=${config_1.default.payment.store_id}&store_passwd=${config_1.default.payment.store_pass}&format=json`,
        });
        return response.data;
    }
    catch (error) {
        throw new AppError_1.default(500, "payment validation failed");
    }
});
const validatePayment2 = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { val_id } = payload;
        payload;
        const response = yield axios_1.default.get(`https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${config_1.default.payment.store_id}&store_passwd=${config_1.default.payment.store_pass}&v=1&format=json`);
        return response.data;
    }
    catch (error) {
        throw new Error((error === null || error === void 0 ? void 0 : error.message) || "Payment validation failed");
    }
});
exports.PaymentServicesSSL = {
    initPayment,
    validatePayment,
    validatePayment2,
};
