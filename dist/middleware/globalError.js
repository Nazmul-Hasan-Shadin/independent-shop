"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/prisma/client");
const sanitizeError = (error) => {
    var _a;
    if (process.env.NODE_ENV === "production" && ((_a = error === null || error === void 0 ? void 0 : error.code) === null || _a === void 0 ? void 0 : _a.startsWith("P"))) {
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
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";
    let errorDetails = err;
    // ===== Prisma Validation =====
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Validation error";
        errorDetails = err.message;
    }
    // ===== Prisma Known =====
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
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
exports.default = globalErrorHandler;
