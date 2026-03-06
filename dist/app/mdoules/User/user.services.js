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
exports.UserServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.email || !payload.password || !payload.username) {
        throw new AppError_1.default(400, "Required fields are missing");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 12);
    const result = prisma_1.default.user.create({
        data: Object.assign(Object.assign({}, payload), { password: hashedPassword }),
    });
    return result;
});
const getUserByEmail = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email: userInfo.email,
        },
        include: {
            Order: true,
            shop: true,
            shopFollower: true,
        },
    });
    return user;
});
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findMany({});
    return user;
});
exports.UserServices = {
    createUser,
    getUserByEmail,
    getAllUser,
};
