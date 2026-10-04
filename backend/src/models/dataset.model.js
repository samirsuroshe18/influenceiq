import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    postId: { type: String, required: true },
    postType: { type: String, required: true },
    // a calendar day, YYYY-MM-DD
    datePosted: { type: String, required: true },
    likes: { type: Number, required: true },
    shares: { type: Number, required: true },
    comments: { type: Number, required: true },
    views: { type: Number, required: true },
}, { _id: false });

// The posts of one account. The sample has the token "sample"; an upload has a random
// token, and knowing it is what lets a visitor read the dataset.
const datasetSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    isSample: {
        type: Boolean,
        default: false,
    },

    posts: [postSchema],

    // set on uploads only: the database removes the dataset when this moment has passed
    expiresAt: {
        type: Date,
        index: { expireAfterSeconds: 0 },
    },

}, { timestamps: true });

export const Dataset = mongoose.model("Dataset", datasetSchema);
