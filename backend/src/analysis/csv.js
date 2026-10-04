import { parse } from 'csv-parse/sync';
import ApiError from '../utils/ApiError.js';

export const MAX_ROWS = 2000;
export const POST_TYPES = ['reels', 'carousel', 'static'];

const REQUIRED = ['post_type', 'date_posted', 'likes', 'shares', 'comments'];
const COUNTS = ['likes', 'shares', 'comments', 'views'];
const LISTED_SKIPS = 20;
const MAX_COLUMNS = 50;
// no row of posts is anywhere near this long; a longer one is not a table of posts
const MAX_ROW_LENGTH = 20000;
const POST_ID_MAX = 40;

// up to 12 digits: two thousand of them still add up exactly
const WHOLE_NUMBER = /^\d{1,12}$/;
const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

const refuse = (message) => {
    throw new ApiError(400, message);
};

// a day that exists in the calendar, written as YYYY-MM-DD
const isCalendarDay = (text) => {
    const parts = DAY.exec(text);
    if (!parts) return false;

    const [year, month, day] = parts.slice(1).map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

const typeOf = (text) => {
    const type = text.toLowerCase();
    return type === 'reel' ? 'reels' : type;
};

// one row as a post, or the reason it cannot be one
const readRow = (cells, columns, number) => {
    const cell = (name) => (columns[name] === undefined ? '' : (cells[columns[name]] || '').trim());

    const postType = typeOf(cell('post_type'));
    if (!POST_TYPES.includes(postType)) {
        return { reason: 'post_type must be reels, carousel or static' };
    }

    const datePosted = cell('date_posted');
    if (!isCalendarDay(datePosted)) {
        return { reason: 'date_posted must be a date like 2026-03-15' };
    }

    // the id is free text that is shown and passed on, so it is kept short and printable
    const postId = cell('post_id').replace(/[\u0000-\u001f\u007f-\u009f]/g, '').slice(0, POST_ID_MAX).trim();
    const post = { postId: postId || String(number), postType, datePosted };

    for (const name of COUNTS) {
        // views are optional: a file without them, or an empty cell, counts as 0
        const text = name === 'views' && cell(name) === '' ? '0' : cell(name);

        if (!WHOLE_NUMBER.test(text)) {
            return { reason: `${name} must be a whole number, 0 or more` };
        }

        post[name] = Number(text);
    }

    return { post };
};

// Reads the posts out of an uploaded CSV file. A row that breaks a rule is skipped and
// reported; a file that cannot be used at all is refused with the reason.
const readPosts = (buffer) => {
    // a text file has no zero bytes; an image or a spreadsheet file does
    if (buffer.includes(0)) {
        refuse('The file could not be read as CSV');
    }

    // one kind of line end, whatever the file mixes
    const text = buffer.toString('utf8').replace(/\r\n?/g, '\n');

    if (!text.trim()) {
        refuse('The file is empty');
    }

    // a line this long is not a row of a table of posts, and reading it would be slow
    if (text.split('\n').some((line) => line.length > MAX_ROW_LENGTH)) {
        refuse('The file could not be read as CSV');
    }

    let records;
    try {
        records = parse(text, {
            bom: true,
            skip_empty_lines: true,
            relax_column_count: true,
            // the line each record is on, for the report of skipped rows
            info: true,
            // reading stops as soon as the file is known to be too long
            to: MAX_ROWS + 2,
            max_record_size: MAX_ROW_LENGTH,
        });
    } catch (error) {
        refuse('The file could not be read as CSV');
    }

    // lines made of spaces only are not rows
    records = records.filter(({ record }) => record.some((value) => value.trim() !== ''));

    if (records.length === 0) {
        refuse('The file is empty');
    }

    if (records[0].record.length > MAX_COLUMNS) {
        refuse('The file has too many columns');
    }

    const header = records[0].record.map((name) => name.trim().toLowerCase());
    const columns = Object.fromEntries(header.map((name, index) => [name, index]));

    if (!REQUIRED.some((name) => name in columns)) {
        refuse(`The file needs a header row with: ${REQUIRED.join(', ')}`);
    }

    const missing = REQUIRED.find((name) => !(name in columns));
    if (missing) {
        refuse(`Missing column: ${missing}`);
    }

    const rows = records.slice(1);

    if (rows.length > MAX_ROWS) {
        refuse(`The file has more than ${MAX_ROWS} rows`);
    }

    const posts = [];
    const skipped = { count: 0, rows: [] };

    rows.forEach(({ record, info }, index) => {
        const { post, reason } = readRow(record, columns, index + 1);

        if (post) {
            posts.push(post);
            return;
        }

        skipped.count += 1;
        if (skipped.rows.length < LISTED_SKIPS) {
            skipped.rows.push({ line: info.lines, reason });
        }
    });

    if (posts.length === 0) {
        refuse('No valid rows were found in the file');
    }

    return { posts, skipped };
};

export { readPosts }
