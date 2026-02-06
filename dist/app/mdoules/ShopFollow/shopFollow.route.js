"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const shopFollow_controller_1 = require("./shopFollow.controller");
const auth_1 = __importDefault(require("../Auth/auth"));
const client_1 = require("../../../generated/prisma/client");
const router = (0, express_1.default)();
router.post("/check-validity-follow", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin, client_1.Role.vendor), shopFollow_controller_1.FollowerController.checkFollowValidity);
router.post("/follow", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin, client_1.Role.vendor), shopFollow_controller_1.FollowerController.followShop);
router.post("/unfollow", (0, auth_1.default)(client_1.Role.user, client_1.Role.admin, client_1.Role.vendor), shopFollow_controller_1.FollowerController.unfollowShop);
exports.FollowerRoutes = router;
