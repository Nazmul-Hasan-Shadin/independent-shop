import { IAuthUser } from "../../../interface/common";
import prisma from "../../../utils/prisma";
import AppError from "../../error/AppError";

const createOrder = async (payload: any) => {
  const { shopId, customerId, guestName,guestPhone,guestAddress,paymentMethod,totalAmount, orderItems, status,transactionId } = payload;
  console.log(shopId, customerId, totalAmount, orderItems,';bola');

  // Create the order and associated order items

  console.log(orderItems);
// if (!customerId) {

// }
  if (!guestPhone || !guestName || !guestAddress) {
    throw new AppError(400, "Guest details are required for guest checkout");
  }
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        shop:{
          connect: { id: shopId }, 
        },
        transactionId,
...(customerId && {
  customer: {
    connect: { id: customerId },
  },
}),
        totalAmount,
        status: status,
        paymentMethod,
        guestName:guestName,
        guestPhone,
        guestAddress,
        orderItems: {
          create: orderItems.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    await Promise.all(
      orderItems.map((order: any) =>
        tx.product.update({
          where: {
            id: order.id,
          },
          data: {
            salesCount: { increment: 1 },
          },
        })
      )
    );
  });
};






const getAllOrdersFromDB = async (user: IAuthUser) => {
  let result;

  if (user.role === "vendor") {
    result = await prisma.order.findMany({
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
  } else if (user.role === "admin") {
    result = await prisma.order.findMany({
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
  } else if (user.role === "user") {
    result = await prisma.order.findMany({
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
};

const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUniqueOrThrow({
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
};

  const getOrderItemsById=async (orderId:string)=>{
     const orderItems= await prisma.orderItem.findMany({
      where:{
        orderId:orderId
      },
      include:{
        product:{
          select:{
            name:true
          }
        }
      }
     })

     return orderItems
  }

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

export const OrderServices = {
  createOrder,
  getOrderById,
  getAllOrdersFromDB,
  //   updateOrderStatus,
  //   deleteOrder,
  getOrderItemsById
};
