import { Router } from "express";
import { acceptCsv } from '../middlewares/upload.middleware.js'
import { uploadLimiter } from '../middlewares/rateLimit.middleware.js'
import { downloadSample, getAnalytics, removeDataset, uploadDataset } from "../controllers/dataset.controller.js";

const router = Router();

router.route('/').post(uploadLimiter, acceptCsv, uploadDataset);

// before the routes with an id, so "sample.csv" is never taken for one
router.route('/sample.csv').get(downloadSample);

router.route('/:id/analytics').get(getAnalytics);
router.route('/:id').delete(removeDataset);


export default router;
