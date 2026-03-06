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
exports.AuthServices = void 0;
const enums_1 = require("../../../generated/prisma/enums");
const config_1 = __importDefault(require("../../../config"));
const jwtUtils_1 = require("../../../utils/jwtUtils");
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendMail_1 = require("../../../utils/sendMail");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
            status: enums_1.UserStatus.ACTIVE,
        },
    });
    if (!userData) {
        throw new AppError_1.default(404, "User not found");
    }
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new AppError_1.default(401, "password is incorrect");
    }
    const accessToken = (0, jwtUtils_1.generateToken)({ email: userData.email, role: userData.role }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshtoken = (0, jwtUtils_1.generateToken)({ email: userData.email, role: userData.role }, config_1.default.jwt.refreshToken_sec, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshtoken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: enums_1.UserStatus.ACTIVE,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error("password is incorrect");
    }
    const hashPassword = yield bcrypt_1.default.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashPassword,
        },
    });
    return {
        message: "password changed successfully",
    };
});
const forgetPassword = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: id,
        },
    });
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (!user) {
        throw new AppError_1.default(404, "This user is not found ");
    }
    const jwtPayload = { email: user.email, role: user.role };
    const resetToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt.reset_pass_token, {
        expiresIn: "10m",
    });
    const resetUILink = `https://e-commerce-frontend-beryl-nu.vercel.app/reset-pass?id=${user.email}&token=${resetToken}`;
    (0, sendMail_1.sendEmail)(user === null || user === void 0 ? void 0 : user.email, resetUILink);
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!user) {
        throw new AppError_1.default(404, "This user is not found ");
    }
    if (!token) {
        throw new AppError_1.default(403, "you are forbidden");
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.reset_pass_token);
    if (payload.email !== decoded.email) {
        throw new AppError_1.default(401, "Your are forbidden");
    }
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, 7);
    const result = yield prisma_1.default.user.update({
        where: {
            email: decoded.email,
            role: decoded.role,
        },
        data: {
            password: newHashedPassword,
        },
    });
});
exports.AuthServices = {
    loginUser,
    changePassword,
    forgetPassword,
    resetPassword,
};
