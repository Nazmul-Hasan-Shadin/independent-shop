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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createShop = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        req.body.logo = req === null || req === void 0 ? void 0 : req.file.path;
    }
    const newShop = yield prisma_1.default.shop.create({
        data: req.body,
        include: {
            vendor: true,
        },
    });
    return newShop;
});
const getTopTenShop = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.findMany({
        include: {
            _count: {
                select: {
                    product: true
                }
            }
        },
    });
    return result;
});
const getAllShop = (filterQuery, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filterQuery, othersFilter = __rest(filterQuery, ["searchTerm"]);
    console.log(othersFilter, 'otherFileters');
    console.log(filterQuery, 'filterquery');
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            OR: ["name", "description"].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    const filteredQuery = Object.assign({}, options);
    const excludePaginationParameterFromQuery = [
        "limit",
        "page",
        "orderBy",
        'searchTerm',
        "sortBy",
    ];
    for (const key of excludePaginationParameterFromQuery) {
        delete filteredQuery[key];
    }
    if (Object.keys(filteredQuery).length > 0) {
        const filterCondition = Object.keys(filterQuery).map((key) => ({
            [key]: {
                contains: filterQuery[key],
            },
        }));
        andCondition.push(...filterCondition);
    }
    const filteredWhereCondition = andCondition.length > 0 ? { AND: andCondition } : {};
    console.log(filterQuery === null || filterQuery === void 0 ? void 0 : filterQuery.limit, 'k');
    let limit = Number(filterQuery.limit) || 12;
    let page = Number(filterQuery.page) || 1;
    let skip = (page - 1) * limit;
    const result = yield prisma_1.default.shop.findMany({
        where: filteredWhereCondition,
        include: {
            _count: {
                select: {
                    product: true,
                    Order: true,
                    shopFollower: true
                }
            }
        },
        skip: skip,
        take: limit,
        orderBy: filterQuery.sortBy && (filterQuery === null || filterQuery === void 0 ? void 0 : filterQuery.orderBy) ? { [filterQuery.orderBy]: filterQuery.sortBy } : { createdAt: 'asc' }
    });
    const total = yield prisma_1.default.product.count({ where: filteredWhereCondition });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getShopById = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.shop.findUnique({
        where: {
            id: shopId,
        },
        include: {
            shopFollower: true,
        },
    });
    return result;
});
exports.shopServices = {
    createShop,
    getShopById,
    getTopTenShop,
    getAllShop,
};
