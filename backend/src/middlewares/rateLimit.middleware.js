import { rateLimit } from 'express-rate-limit';
import ApiError from '../utils/ApiError.js';
import { visitorOf } from '../utils/visitor.js';

const HOUR_MS = 60 * 60 * 1000;
const UPLOADS_PER_HOUR = 10;
// many visitors can arrive through the same proxy address
const CONNECTION_FACTOR = 10;

// The automated tests switch the limit on by setting UPLOAD_RATE_LIMIT; otherwise
// it would get in the way of every test.
const skippedInTests = () => process.env.NODE_ENV === 'test' && !process.env.UPLOAD_RATE_LIMIT;

const uploadsAllowed = () => Number(process.env.UPLOAD_RATE_LIMIT) || UPLOADS_PER_HOUR;

const limiter = (limit, keyGenerator) => rateLimit({
    windowMs: HOUR_MS,
    limit,
    keyGenerator,
    skip: skippedInTests,
    standardHeaders: true,
    legacyHeaders: false,
    validate: false,
    handler: (req, res, next) => next(new ApiError(429, "Too many uploads. Please try again in an hour.")),
});

// one limit for the visitor, and a wider one for the address the request arrived from,
// which cannot be made up
const uploadLimiter = [
    limiter(uploadsAllowed, visitorOf),
    limiter(() => uploadsAllowed() * CONNECTION_FACTOR, (req) => `connection:${req.ip}`),
];

export { uploadLimiter }
