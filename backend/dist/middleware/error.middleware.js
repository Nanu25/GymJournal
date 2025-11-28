"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const errorHandler = (err, req, res, _next) => {
    let error = err;
    if (!(error instanceof AppError_1.AppError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || 'Internal Server Error';
        error = new AppError_1.AppError(message, statusCode);
    }
    const statusCode = error.statusCode;
    const message = error.message;
    console.error(`[ERROR] ${req.method} ${req.url} - ${statusCode} - ${message}`);
    if (statusCode === 500) {
        console.error(err.stack);
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map