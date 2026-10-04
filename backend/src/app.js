import express from "express";
import cors from 'cors';
import ApiError from './utils/ApiError.js';
import ApiResponse from './utils/ApiResponse.js';
import datasetRouter from './routes/dataset.routes.js';

const app = express();

// behind the host's proxy the connection's own address is the proxy; this makes
// req.ip the address the proxy saw
app.set('trust proxy', 1);

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: '100kb' }));

app.get("/api/v1/health", (req, res) => {
    return res.status(200).json(new ApiResponse(200, { status: 'ok' }, "OK"));
});

app.use("/api/v1/datasets", datasetRouter);

app.use((req, res, next) => {
    next(new ApiError(404, "Route not found"));
});

// Custom error handling
app.use((err, req, res, next) => {
    // a body that could not be read, or one that is too large, is the sender's mistake
    const isBodyError = err.type === 'entity.parse.failed' || err.type === 'entity.too.large';
    const statusCode = err.statusCode || err.status || (isBodyError ? 400 : 500);
    // an unexpected failure can carry database or stack details, so only messages
    // written for the client (ApiError) or for a 4xx are sent back
    const isUnexpected = statusCode >= 500 && !(err instanceof ApiError);
    const message = isUnexpected ? "Internal server error" : (isBodyError ? "The request could not be read" : (err.message || "Internal server error"));

    if (statusCode >= 500) {
        console.log(err);
    }

    return res.status(statusCode).json({
        statusCode: statusCode,
        message: message,
        success: false
    });
})

export default app
