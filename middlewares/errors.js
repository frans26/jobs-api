const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errorMsg: err.message,
            stack: err.stack
        });
    }

    if (process.env.NODE_ENV === 'production') {
        let errorMessage = err.message || "Internal server error";

        if (err.name === 'CastError') {
            const msg = `Resource not found. Invalid ${err.path}`;
            errorMessage = new ErrorHandler(msg, 404).message;
        }

        if (err.name === 'ValidationError') {
            const msg = Object.values(err.errors).map(e => e.message);
            errorMessage = new ErrorHandler(msg, 400).message;
        }

        res.status(err.statusCode).json({
            success: false,
            message: errorMessage
        });
    }
}
