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
    var _a, _b, _c, _d;
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
            const field = ((_d = (_c = (_b = (_a = err.meta) === null || _a === void 0 ? void 0 : _a.driverAdapterError) === null || _b === void 0 ? void 0 : _b.cause) === null || _c === void 0 ? void 0 : _c.constraint) === null || _d === void 0 ? void 0 : _d.fields[0]) || 'field';
            message = `${field} already exist`;
            errorDetails = err.meta;
        }
    }
    const safeError = sanitizeError(Object.assign(Object.assign({}, err), { message,
        errorDetails }));
    res.status(statusCode).json({
        success: false,
        message: safeError.message || message,
        error: safeError.errorDetails || errorDetails,
    });
};
exports.default = globalErrorHandler;
