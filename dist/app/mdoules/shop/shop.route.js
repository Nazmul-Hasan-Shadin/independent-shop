"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRoutes = void 0;
const express_1 = __importDefault(require("express"));
const shop_controller_1 = require("./shop.controller");
const auth_1 = __importDefault(require("../Auth/auth"));
const enums_1 = require("../../../generated/prisma/enums");
const fileUploader_1 = require("../../../utils/fileUploader");
const router = (0, express_1.default)();
router.get("/", shop_controller_1.ShopController.getTopTenShop);
router.get("/all-shops", (0, auth_1.default)(enums_1.Role.admin), shop_controller_1.ShopController.getAllShop);
router.get("/:id", shop_controller_1.ShopController.shopById);
router.post("/create-shop", fileUploader_1.fileUpload.multerUpload.single("file"), (0, auth_1.default)(enums_1.Role.vendor, enums_1.Role.admin), (req, res, next) => {
    (req.body = JSON.parse(req.body.data)),
        shop_controller_1.ShopController.createShop(req, res, next);
});
exports.ShopRoutes = router;
