import { Request } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { OrderServices } from "./order.services";
import { IAuthUser } from "../../../interface/common";

const createOrder = catchAsync(async (req, res, next) => {
  
  const result = await OrderServices.createOrder(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const getAllOrders = catchAsync(
  async (req: Request & { user?: IAuthUser }, res, next) => {
    const user = req.user;

    
    const result = await OrderServices.getAllOrdersFromDB(user!);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Orders retrieved successfully",
      data: result,
    });
  }
);

const getOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params ;

  const result = await OrderServices.getOrderById(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});

const getOrderItems = catchAsync(async (req, res, next) => {
  const { orderId } = req.params ;

  const result = await OrderServices.getOrderItemsById(orderId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order items fetched successfully",
    data: result,
  });
});

//   const updateOrderStatus = catchAsync(async (req, res, next) => {
//     const { id } = req.params;
//     const { status } = req.body;

//     const result = await OrderServices.updateOrderStatus(id, status);

//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "Order status updated successfully",
//       data: result,
//     });
//   });

//   const deleteOrder = catchAsync(async (req, res, next) => {
//     const { id } = req.params;

//     const result = await OrderServices.deleteOrder(id);

//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: result.message,
//       data:result
//     });
//   });

export const OrderController = {
  createOrder,
  getOrderById,
  getAllOrders,
  // updateOrderStatus,
  // deleteOrder
  getOrderItems
};
