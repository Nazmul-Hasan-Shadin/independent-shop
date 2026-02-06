"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("./auth"));
const enums_1 = require("../../../generated/prisma/enums");
const router = express_1.default.Router();
router.post("/login", auth_controller_1.AuthController.loginUser);
router.post("/change-password", (0, auth_1.default)(enums_1.Role.user, enums_1.Role.admin, enums_1.Role.vendor), auth_controller_1.AuthController.changePassword);
router.post("/forget-password", auth_controller_1.AuthController.forgetPassword);
router.post("/reset-password", auth_controller_1.AuthController.resetPassword);
exports.AuthRoutes = router;
