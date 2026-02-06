"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const enums_1 = require("../../../generated/prisma/enums");
const meta_controller_1 = require("./meta.controller");
const auth_1 = __importDefault(require("../Auth/auth"));
const router = express_1.default.Router();
router.get("/meta", (0, auth_1.default)(enums_1.Role.admin, enums_1.Role.user, enums_1.Role.vendor), meta_controller_1.MetaController.getRoleMeta);
exports.MetaRoutes = router;
