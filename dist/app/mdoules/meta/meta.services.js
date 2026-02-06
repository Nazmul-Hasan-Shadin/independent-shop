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
exports.MetaServices = void 0;
const enums_1 = require("../../../generated/prisma/enums");
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const fetchDashboardMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    switch (user.role) {
        case enums_1.Role.admin:
            return getAdminMetaData(user);
            break;
        case enums_1.Role.vendor:
            return getVendorMetaData(user);
            break;
        default:
            throw new AppError_1.default(404, "invalid role");
    }
});
const getAdminMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const vendorCount = yield prisma_1.default.user.count({
        where: {
            role: enums_1.Role.vendor,
        },
    });
    const userCount = yield prisma_1.default.user.count({
        where: {
            role: enums_1.Role.user,
        },
    });
    const adminCount = yield prisma_1.default.user.count({
        where: {
            role: enums_1.Role.admin,
        },
    });
    const totalRevenu = yield prisma_1.default.order.aggregate({
        _sum: {
            totalAmount: true,
        },
    });
    return {
        vendorCount,
        userCount,
        totalRevenu: (_a = totalRevenu === null || totalRevenu === void 0 ? void 0 : totalRevenu._sum) === null || _a === void 0 ? void 0 : _a.totalAmount,
        adminCount,
    };
});
const getVendorMetaData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const orderCount = yield prisma_1.default.order.count({
        where: {
            shop: {
                vendor: {
                    email: user.email,
                },
            },
        },
    });
    const totalRevenu = yield prisma_1.default.order.aggregate({
        _sum: {
            totalAmount: true,
        },
        where: {
            shop: {
                vendor: {
                    email: user.email,
                },
            },
        },
    });
    const totalReview = yield prisma_1.default.review.count({
        where: {
            product: {
                shop: {
                    vendor: {
                        email: user.email,
                    },
                },
            },
        },
    });
    const productCount = yield prisma_1.default.product.count({
        where: {
            shop: {
                vendor: {
                    email: user.email,
                },
            },
        },
    });
    const saleCountByMonth = yield prisma_1.default.$queryRaw `
  SELECT 
    DATE_TRUNC('month', "createdAt") AS month,
    COUNT(*) AS count
  FROM "orders"
  GROUP BY month
  ORDER BY month ASC
`;
    const serializedSaleCountByMonth = saleCountByMonth.map((item) => ({
        month: item.month, // Assuming month is a Date or string, no change needed
        count: Number(item.count), // Convert BigInt to number
    }));
    //   console.log( {orderCount,totalRevenu,totalReview,productCount});
    return {
        orderCount,
        totalRevenu: (_a = totalRevenu === null || totalRevenu === void 0 ? void 0 : totalRevenu._sum) === null || _a === void 0 ? void 0 : _a.totalAmount,
        totalReview,
        productCount,
        saleCountByMonth: serializedSaleCountByMonth
    };
});
// const getUserMetaData = async (user: IAuthUser) => {
//   const vendorCount = await prisma.user.count({
//     where: {
//       role: "vendor",
//     },
//   });
//   const userCount = await prisma.user.count({});
//   const totalRevenu = await prisma.order.aggregate({
//     _sum: {
//       totalAmount: true,
//     },
//   });
// };
// const getBarChartData=async()=>{
//      const saleCountByMonth:{month:Date}=await prisma.$queryRaw`
//      SELECT DATE_TRUNC('month','createdAt') AS month;
//      COUNT(*) AS count,
//      FROM "order"
//      GROUP BY month
//      ORDER BY month ASC
//      `
// }
exports.MetaServices = {
    fetchDashboardMetaData,
};
