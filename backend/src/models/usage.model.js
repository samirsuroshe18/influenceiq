import mongoose, { Schema } from "mongoose";

// How many questions were asked on one day: by one visitor, or on the whole site.
// Kept in the database so a restart of the server does not start the count again.
const usageSchema = new Schema({
    // "visitor:<address>" or "site"
    key: {
        type: String,
        required: true,
    },

    // a UTC day, YYYY-MM-DD
    day: {
        type: String,
        required: true,
    },

    count: {
        type: Number,
        default: 0,
    },

    // old counts are removed by the database
    expiresAt: {
        type: Date,
        index: { expireAfterSeconds: 0 },
    },
});

usageSchema.index({ key: 1, day: 1 }, { unique: true });

export const Usage = mongoose.model("Usage", usageSchema);
