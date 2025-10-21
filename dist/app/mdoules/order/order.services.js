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
exports.OrderServices = void 0;
const prisma_1 = __importDefault(require("../../../utils/prisma"));
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId, customerId, totalAmount, orderItems, status } = payload;
    console.log(shopId, customerId, totalAmount, orderItems, ';bola');
    // Create the order and associated order items
    return prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const order = yield tx.order.create({
            data: {
                shop: {
                    connect: { id: shopId },
                },
                customer: {
                    connect: { id: customerId },
                },
                totalAmount,
                status: status,
                orderItems: {
                    create: orderItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                orderItems: true,
            },
        });
        yield Promise.all(orderItems.map((order) => tx.product.update({
            where: {
                id: order.productId,
            },
            data: {
                salesCount: { increment: 1 },
            },
        })));
    }));
});
const getAllOrdersFromDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    if (user.role === "vendor") {
        result = yield prisma_1.default.order.findMany({
            where: {
                shop: {
                    vendor: {
                        email: user.email,
                    },
                },
            },
            include: {
                shop: true,
                customer: true,
                orderItems: {
                    include: {
                        product: true,
                        order: {
                            include: {
                                orderItems: {
                                    include: {
                                        product: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    else if (user.role === "admin") {
        result = yield prisma_1.default.order.findMany({
            include: {
                shop: true,
                customer: true,
                orderItems: {
                    include: {
                        product: {
                            include: {
                                OrderItems: {
                                    include: {
                                        product: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    else if (user.role === "user") {
        result = yield prisma_1.default.order.findMany({
            where: {
                customer: {
                    email: user.email,
                },
            },
            include: {
                shop: true,
                customer: true,
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    return result;
});
const getOrderById = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield prisma_1.default.order.findUniqueOrThrow({
        where: { id: orderId },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
            shop: true,
            customer: true,
        },
    });
    return order;
});
// const updateOrderStatus = async (orderId: string, status: string) => {
//   const updatedOrder = await prisma.order.update({
//     where: { id: orderId },
//     data: { status },
//   });
//   return updatedOrder;
// };
// const deleteOrder = async (orderId: string) => {
//   await prisma.order.delete({
//     where: { id: orderId },
//   });
//   return { message: "Order deleted successfully" };
// };
exports.OrderServices = {
    createOrder,
    getOrderById,
    getAllOrdersFromDB,
    //   updateOrderStatus,
    //   deleteOrder,
};
