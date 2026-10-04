import multer from "multer";
import ApiError from "../utils/ApiError.js";

const MAX_BYTES = 1024 * 1024;

const WRONG_TYPE = "Only .csv files are accepted";
const TOO_LARGE = "The file must be 1 MB or smaller";
const NO_FILE = "Choose a CSV file to upload";

// the file is held in memory and read straight away; nothing is written to disk
const upload = multer({
    storage: multer.memoryStorage(),
    // one file and no other fields: nothing else is held in memory
    limits: { fileSize: MAX_BYTES, files: 1, fields: 0, parts: 2 },
    // file names arrive as UTF-8
    defParamCharset: 'utf8',
    // browsers disagree about the content type of a CSV file, so the name decides
    fileFilter: (req, file, cb) => {
        if (/\.csv$/i.test(file.originalname || '')) {
            cb(null, true);
        } else {
            cb(new ApiError(400, WRONG_TYPE));
        }
    },
});

// Reads a form that must carry one CSV file in the field "file"
const acceptCsv = (req, res, next) => {
    upload.single('file')(req, res, (error) => {
        if (error instanceof ApiError) return next(error);

        if (error?.code === 'LIMIT_FILE_SIZE') return next(new ApiError(400, TOO_LARGE));

        if (error) return next(new ApiError(400, "The file could not be read"));

        if (!req.file) return next(new ApiError(400, NO_FILE));

        next();
    });
};

export { acceptCsv }
