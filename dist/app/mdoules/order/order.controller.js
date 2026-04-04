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
exports.OrderController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const order_services_1 = require("./order.services");
const createOrder = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_services_1.OrderServices.createOrder(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Order created successfully",
        data: result,
    });
}));
const getAllOrders = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield order_services_1.OrderServices.getAllOrdersFromDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Orders retrieved successfully",
        data: result,
    });
}));
const getOrderById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield order_services_1.OrderServices.getOrderById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Order fetched successfully",
        data: result,
    });
}));
const getOrderItems = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield order_services_1.OrderServices.getOrderItemsById(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Order items fetched successfully",
        data: result,
    });
}));
//   const updateOrderStatus = catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const { status } = req.body;
//     const result = await OrderServices.updateOrderStatus(id, status);
//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "Order status updated successfully",
//       data: result,
//     });
//   });
//   const deleteOrder = catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const result = await OrderServices.deleteOrder(id);
//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: result.message,
//       data:result
//     });
//   });
exports.OrderController = {
    createOrder,
    getOrderById,
    getAllOrders,
    // updateOrderStatus,
    // deleteOrder
    getOrderItems
};
