const COLUMNS = [
    ['post_id', 'postId'],
    ['post_type', 'postType'],
    ['date_posted', 'datePosted'],
    ['likes', 'likes'],
    ['shares', 'shares'],
    ['comments', 'comments'],
    ['views', 'views'],
];

// a cell with a comma, a quote or a line break is quoted; a quote inside is doubled
const cell = (value) => {
    const text = String(value);
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

// posts as the text of a CSV file, in the format the upload accepts
const toCsv = (posts) => [
    COLUMNS.map(([header]) => header).join(','),
    ...posts.map((post) => COLUMNS.map(([, field]) => cell(post[field])).join(',')),
].join('\n') + '\n';

export { toCsv }
