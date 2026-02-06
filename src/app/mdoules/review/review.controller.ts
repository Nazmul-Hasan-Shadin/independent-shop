import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

import { IAuthUser } from "../../../interface/common";
import prisma from "../../../utils/prisma";
import { ReviewServices } from "./review.services";
import { ProductServices } from "../product/product.services";

const addReview = catchAsync(async (req, res) => {
  const result = await ReviewServices.addReview(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getProductWithReview = catchAsync(async (req, res, next) => {
  const { productId } = req.params; // Get productId from URL params

  const product = await ReviewServices.getReviewWithProductDetails(productId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product details with reviews retrieved successfully",
    data: product,
  });
});


const myReview = catchAsync(async (req:Request & {user:any}, res:Response, next) => {
 
  

  const product = await ReviewServices.getMyReview(req.user, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "review fetched",
    data: product,
  });
});

export const ReviewController = {
  addReview,
  getProductWithReview,
  myReview
};
