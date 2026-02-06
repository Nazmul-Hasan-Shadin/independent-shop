import { IAuthUser } from "../../../interface/common";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { ProductServices } from "./product.services";

const createProductIntoDb = catchAsync(async (req, res, next) => {
  const result = await ProductServices.createProduct(req);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product is created succesful",
    data: result,
  });
});

const getAllProduct = catchAsync(async (req, res, next) => {
  const query = req.query;
  const result = await ProductServices.getAllProduct(query, query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product are fetch successfully",
    data: result,
  });
});
const getSingleProduct = catchAsync(async (req, res, next) => {
  const result = await ProductServices.getSingleProduct(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product retrived successfully",
    data: result,
  });
});
const incrementProductViewCOunt = catchAsync(async (req, res, next) => {
  const ip:any = req.ip;
  const userAgent = req.get("User-Agent") || "";

  const result = await ProductServices.increaseViewCount(
    req.params.id as string,
    req.body,
    ip,
    userAgent
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "view added",
    data: result,
  });
});

const getProductByShopId = catchAsync(async (req, res, next) => {
  const result = await ProductServices.getProductByShopId(
    req.params.shopId as string,
    req.query
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product are retrived successfully",
    data: result,
  });
});
const updateProduct = catchAsync(async (req, res, next) => {
  const result = await ProductServices.updateProduct(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const result = await ProductServices.deleteProduct(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: result,
  });
});

const  getFollowedShopProduct=catchAsync(async(req,res,next)=>{
  const user =req.user as IAuthUser
  const result = await ProductServices.getFollowedShopProduct(user,req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'jj',
    data: result,
  });
})

export const ProductController = {
  createProductIntoDb,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  getAllProduct,
  getProductByShopId,
  incrementProductViewCOunt,
  getFollowedShopProduct
};
