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
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const productionRedirectUrl = process.env.NODE_ENV === "development"
    ? process.env.REDIRECT_URL_LOCAL
    : process.env.REDIRECT_URL;
const initPayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_services_1.PaymentServicesSSL.initPayment(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "payment init successful",
        data: result,
    });
}));
// const validatePayment = catchAsync(async (req: Request, res: Response) => {
//   const result = await PaymentServicesSSL.validatePayment(req.query);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Payment validation successful",
//     data: result,
//   });
// });
// const handleIPN = catchAsync(async (req, res) => {
//   const { val_id, tran_id, status } = req.body;
//   console.log('ipn',req)
//     console.log('ipn body',req.body)
//   if (!val_id) {
//     res.status(400).json({ message: "val_id missing in IPN" });
//     return;
//   }
//   const result = await PaymentServicesSSL.validatePayment2({
//     val_id,
//     tran_id,
//     status,
//   });
//   // API response---
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "IPN received & validated",
//     data: result,
//   });
// });
const handleIPN = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    if (!payload.tran_id) {
        res.status(400).json({ message: "tran_id or val_id missing" });
        return;
    }
    const result = yield payment_services_1.PaymentServicesSSL.validatePayment2(payload);
    console.log(result, "inside succesurl");
    if (result.status === "VALID") {
        const orderResult = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield tx.order.findUnique({
                where: { transactionId: payload.tran_id },
                include: { orderItems: true },
            });
            if (!order) {
                throw new Error("Order not found");
            }
            // Prevent duplicate update
            if ((order === null || order === void 0 ? void 0 : order.status) === "COMPLETE") {
                return;
            }
            const updateOrder = yield tx.order.update({
                where: {
                    transactionId: payload.tran_id,
                },
                data: {
                    status: "COMPLETE",
                },
                include: {
                    orderItems: true,
                },
            });
            for (let item of updateOrder.orderItems) {
                let updateSalesCount = yield tx.product.update({
                    where: {
                        id: item.productId,
                    },
                    data: {
                        salesCount: {
                            increment: item.quantity,
                        },
                        inventoryCount: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
            return updateOrder;
        }));
        // res.redirect(`${productionRedirectUrl}/success-payment/79guhh`);
    }
    res.status(200).send("IPN processed");
}));
exports.PaymentControllerSSL = {
    initPayment,
    handleIPN,
    // handleSuccess,
};
