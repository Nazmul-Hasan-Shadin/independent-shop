"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const fileUploader_1 = require("../../../utils/fileUploader");
const auth_1 = __importDefault(require("../Auth/auth"));
const enums_1 = require("../../../generated/prisma/enums");
const router = (0, express_1.default)();
router.get("/", product_controller_1.ProductController.getAllProduct);
router.get("/:id", (0, auth_1.default)(), product_controller_1.ProductController.getSingleProduct);
router.get("/shop/products/:shopId", product_controller_1.ProductController.getProductByShopId);
router.post("/create-product", fileUploader_1.fileUpload.multerUpload.array("files"), (req, res, next) => {
    (req.body = JSON.parse(req.body.data)),
        product_controller_1.ProductController.createProductIntoDb(req, res, next);
});
router.post("/:id/view", product_controller_1.ProductController.incrementProductViewCOunt);
router.get("/user/following/products", (0, auth_1.default)(enums_1.Role.user), product_controller_1.ProductController.getFollowedShopProduct);
router.patch("/:id", (0, auth_1.default)(enums_1.Role.admin, enums_1.Role.vendor), product_controller_1.ProductController.updateProduct);
router.delete("/:id", (0, auth_1.default)(enums_1.Role.admin, enums_1.Role.vendor), product_controller_1.ProductController.deleteProduct);
exports.ProductRoutes = router;
