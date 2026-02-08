import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";


const sanitizeError = (error: any) => {

  if (process.env.NODE_ENV === "production" && error?.code?.startsWith("P")) {
    return {
      message: "Database operation failed",
      errorDetails: null,
    };
  }

  return {
    message: error.message,
    errorDetails: error,
  };
};


const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errorDetails: any = err;


  // ===== Prisma Validation =====
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Validation error";
    errorDetails = err.message;
  }


  // ===== Prisma Known =====
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {

    if (err.code === "P2002") {
      statusCode = 409;
      message = "Duplicate field error";
      errorDetails = err.meta;
    }
  }


  const safeError = sanitizeError(err);


  res.status(statusCode).json({
    success: false,
    message: safeError.message || message,
    error: safeError.errorDetails || errorDetails,
  });
};

export default globalErrorHandler; 