import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { PaymentServicesSSL } from "./payment.services";
import { PaymentServices } from "../payment/payment.services";
import prisma from "../../../utils/prisma";

const productionRedirectUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REDIRECT_URL_LOCAL
    : process.env.REDIRECT_URL;

const initPayment = catchAsync(async (req, res, next) => {
  const result = await PaymentServicesSSL.initPayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "payment init successful",
    data: result,
  });
});

// const validatePayment = catchAsync(async (req: Request, res: Response) => {
//   const result = await PaymentServicesSSL.validatePayment(req.query);
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Payment validation successful",

//     data: result,
//   });
// });
// const handleIPN = catchAsync(async (req, res) => {

//   const { val_id, tran_id, status } = req.body;
//   console.log('ipn',req)
//     console.log('ipn body',req.body)

//   if (!val_id) {
//     res.status(400).json({ message: "val_id missing in IPN" });
//     return;
//   }

//   const result = await PaymentServicesSSL.validatePayment2({
//     val_id,
//     tran_id,
//     status,
//   });

//   // API response---
//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "IPN received & validated",
//     data: result,
//   });
// });

const handleIPN = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  if (!payload.tran_id) {
    res.status(400).json({ message: "tran_id or val_id missing" });
    return;
  }
  const result = await PaymentServicesSSL.validatePayment2(payload);
  console.log(result, "inside succesurl");
  if (result.status === "VALID") {
    const orderResult = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { transactionId: payload.tran_id },
        include: { orderItems: true },
      });
      if (!order) {
        throw new Error("Order not found");
      }
      // Prevent duplicate update
      if (order?.status === "COMPLETE") {
        return;
      }

      const updateOrder = await tx.order.update({
        where: {
          transactionId: payload.tran_id,
        },
        data: {
          status: "COMPLETE",
        },
        include: {
          orderItems: true,
        },
      });
      for (let item of updateOrder.orderItems) {
        let updateSalesCount = await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            salesCount: {
              increment: item.quantity,
            },
            inventoryCount: {
              decrement: item.quantity,
            },
          },
        });
      }
      return updateOrder;
    });

    // res.redirect(`${productionRedirectUrl}/success-payment/79guhh`);
  }

  res.status(200).send("IPN processed");
});

export const PaymentControllerSSL = {
  initPayment,

  handleIPN,
  // handleSuccess,
};
