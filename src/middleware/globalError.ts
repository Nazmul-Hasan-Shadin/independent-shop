import { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";

// const sanitizeError = (error: any) => {

//   if (process.env.NODE_ENV === "production" && error?.code?.startsWith("P")) {
//     return {
//       message: "Database operation failed",
//       errorDetails: null,
//     };
//   }

//   return {
//     message: error.message,
//     errorDetails: error,
//   };
// };

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
    message = "Invalid input data";
    statusCode = 400;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const field =
          (err.meta?.target as string[])?.[0] ||
          (err.meta as any)?.driverAdapterError?.cause?.constraint
            ?.fields?.[0] ||
          "field";

        message = `${field} already exists`;
        statusCode = 409;
        break;
      }

      case "P2025":
        message = "Record not found";
        statusCode = 404;
        break;


          case "P2003":
        message = "Invalid reference id";
        statusCode = 400;
        break;

        case "P2000":
        message = "Input value too long";
        statusCode = 400;
        break;
        case "P2014":
        message = "Relation constraint failed";
        statusCode = 400;
        break;

          default:
        message = "Database error";

    }
  }

  // const safeError = sanitizeError({
  //   ...err,
  //   message,
  //   errorDetails,
  // });

  res.status(statusCode).json({
    success: false,
    message: message,
    error: errorDetails,
  });
};

export default globalErrorHandler;
