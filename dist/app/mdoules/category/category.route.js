"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const auth_1 = __importDefault(require("../Auth/auth"));
const enums_1 = require("../../../generated/prisma/enums");
const fileUploader_1 = require("../../../utils/fileUploader");
const router = (0, express_1.default)();
router.get("/", category_controller_1.CategoryController.getCategory);
router.get("/:id", category_controller_1.CategoryController.getCategoryById);
router.post("/create-category", (0, auth_1.default)(enums_1.Role.admin), fileUploader_1.fileUpload.multerUpload.single("file"), (req, res, next) => {
    (req.body = JSON.parse(req.body.data)), console.log(req.body.data, "bsl");
    category_controller_1.CategoryController.createCategory(req, res, next);
}
// CategoryController.createCategory
);
router.put("/:categoryId", category_controller_1.CategoryController.updateCategory);
router.delete("/:categoryId", category_controller_1.CategoryController.deleteCategory);
exports.CategoryRoutes = router;
