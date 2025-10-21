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
exports.PaymentControllerSSL = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const payment_services_1 = require("./payment.services");
const initPayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_services_1.PaymentServicesSSL.initPayment(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Orders retrieved successfully",
        data: result,
    });
}));
const validatePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_services_1.PaymentServicesSSL.validatePayment(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Payment validation successful",
        data: result,
    });
}));
const handleIPN = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("fuckkdjfdkjf");
    const { val_id, tran_id, status } = req.body;
    if (!val_id) {
        res.status(400).json({ message: "val_id missing in IPN" });
        return;
    }
    const result = yield payment_services_1.PaymentServicesSSL.validatePayment2({
        val_id,
        tran_id,
        status,
    });
    // API response---
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "IPN received & validated",
        data: result,
    });
}));
const handleSuccess = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tran_id } = req.params;
    if (!tran_id) {
        res.status(400).json({ message: "tran_id or val_id missing" });
        return;
    }
    res.redirect(`https://independent-mart.vercel.app/success-payment/${tran_id}`);
}));
exports.PaymentControllerSSL = {
    initPayment,
    validatePayment,
    handleIPN,
    handleSuccess,
};
