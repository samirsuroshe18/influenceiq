import crypto from 'crypto';
import asyncHandler from '../utils/asynchandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { Dataset } from '../models/dataset.model.js';
import { readPosts } from '../analysis/csv.js';
import { figuresOf } from '../analysis/figures.js';
import { SAMPLE_TOKEN } from '../analysis/sample.js';
import { toCsv } from '../utils/csvFile.js';

const KEPT_MS = 7 * 24 * 60 * 60 * 1000;
const NAME_MAX = 60;
const DEFAULT_NAME = 'Uploaded posts';
const UPLOAD_TOKEN = /^[0-9a-f]{32}$/;

// what the pages need to know about a dataset; the token of an upload is its id
const describe = (dataset) => ({
    id: dataset.token,
    name: dataset.name,
    isSample: dataset.isSample,
    postCount: dataset.posts.length,
    expiresAt: dataset.expiresAt || null,
});

const postsOf = (dataset) => dataset.posts.map((post) => post.toObject());

// Finds the dataset an id stands for. Only the two shapes an id can have ever reach
// the database.
const findDataset = async (id) => {
    const known = id === SAMPLE_TOKEN || UPLOAD_TOKEN.test(id);
    const dataset = known ? await Dataset.findOne({ token: id }) : null;

    if (!dataset) {
        throw new ApiError(404, "Dataset not found");
    }

    return dataset;
};

// the file's name without its extension, with nothing but printable characters
const nameFrom = (filename) => {
    const name = String(filename || '')
        .replace(/\.csv$/i, '')
        .replace(/[\u0000-\u001f\u007f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, NAME_MAX)
        .trim();

    return name || DEFAULT_NAME;
};

const uploadDataset = asyncHandler(async (req, res) => {
    const { posts, skipped } = readPosts(req.file.buffer);

    const dataset = await Dataset.create({
        token: crypto.randomBytes(16).toString('hex'),
        name: nameFrom(req.file.originalname),
        posts,
        expiresAt: new Date(Date.now() + KEPT_MS),
    });

    const note = skipped.count > 0 ? `; ${skipped.count} ${skipped.count === 1 ? 'row was' : 'rows were'} skipped` : '';

    return res.status(201).json(
        new ApiResponse(201, { dataset: describe(dataset), skipped }, `Dataset uploaded${note}`)
    );
});

const getAnalytics = asyncHandler(async (req, res) => {
    const dataset = await findDataset(req.params.id);
    const posts = postsOf(dataset);

    return res.status(200).json(
        new ApiResponse(200, { dataset: describe(dataset), ...figuresOf(posts), posts }, "Analytics")
    );
});

const downloadSample = asyncHandler(async (req, res) => {
    const dataset = await findDataset(SAMPLE_TOKEN);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="influenceiq-sample.csv"');

    return res.status(200).send(toCsv(postsOf(dataset)));
});

const removeDataset = asyncHandler(async (req, res) => {
    const dataset = await findDataset(req.params.id);

    if (dataset.isSample) {
        throw new ApiError(403, "The sample dataset cannot be removed");
    }

    await dataset.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Dataset removed")
    );
});

export { uploadDataset, getAnalytics, downloadSample, removeDataset, findDataset, describe, postsOf }
