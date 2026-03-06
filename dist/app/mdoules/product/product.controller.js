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
exports.ProductController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const product_services_1 = require("./product.services");
const createProductIntoDb = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const result = yield product_services_1.ProductServices.createProduct(req);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product is created succesful",
        data: result,
    });
}));
const getAllProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield product_services_1.ProductServices.getAllProduct(query, query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product are fetch successfully",
        data: result,
    });
}));
const getSingleProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.ProductServices.getSingleProduct(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product retrived successfully",
        data: result,
    });
}));
const incrementProductViewCOunt = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = req.ip;
    const userAgent = req.get("User-Agent") || "";
    const result = yield product_services_1.ProductServices.increaseViewCount(req.params.id, req.body, ip, userAgent);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "view added",
        data: result,
    });
}));
const getProductByShopId = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.ProductServices.getProductByShopId(req.params.shopId, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product are retrived successfully",
        data: result,
    });
}));
const updateProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.ProductServices.updateProduct(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Product updated successfully",
        data: result,
    });
}));
const deleteProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.ProductServices.deleteProduct(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: result,
    });
}));
const getFollowedShopProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield product_services_1.ProductServices.getFollowedShopProduct(user, req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'jj',
        data: result,
    });
}));
exports.ProductController = {
    createProductIntoDb,
    updateProduct,
    deleteProduct,
    getSingleProduct,
    getAllProduct,
    getProductByShopId,
    incrementProductViewCOunt,
    getFollowedShopProduct
};
