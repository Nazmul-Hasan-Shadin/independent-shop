import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { PaymentServicesSSL } from "./payment.services";

const initPayment = catchAsync(async (req, res, next) => {
  const result = await PaymentServicesSSL.initPayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Orders retrieved successfully",
    data: result,
  });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServicesSSL.validatePayment(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment validation successful",

    data: result,
  });
});
const handleIPN = catchAsync(async (req, res) => {
  console.log("fuckkdjfdkjf");

  const { val_id, tran_id, status } = req.body;

  if (!val_id) {
    res.status(400).json({ message: "val_id missing in IPN" });
    return;
  }

  const result = await PaymentServicesSSL.validatePayment2({
    val_id,
    tran_id,
    status,
  });

  // API response---
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "IPN received & validated",
    data: result,
  });
});


const handleSuccess = catchAsync(async (req: Request, res: Response) => {
  const { tran_id} = req.params;

  if (!tran_id) {
    res.status(400).json({ message: "tran_id or val_id missing" });
    return;
  }

   res.redirect(`https://independent-mart.vercel.app/success-payment/${tran_id}`);
});


export const PaymentControllerSSL = {
  initPayment,
  validatePayment,
  handleIPN,
  handleSuccess,
};
