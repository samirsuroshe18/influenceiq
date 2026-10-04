import { readPosts, MAX_ROWS } from '../src/analysis/csv.js';

const HEADER = 'post_id,post_type,date_posted,likes,shares,comments,views';
const file = (...lines) => Buffer.from(lines.join('\n'));
const refusal = (buffer) => {
    try {
        readPosts(buffer);
    } catch (error) {
        return { status: error.statusCode, message: error.message };
    }
    return null;
};

describe('a good file', () => {
    test('rows become posts', () => {
        const { posts, skipped } = readPosts(file(HEADER, 'p1,reels,2026-03-15,120,30,12,4000', 'p2,static,2026-03-16,40,2,5,900'));

        expect(posts).toEqual([
            { postId: 'p1', postType: 'reels', datePosted: '2026-03-15', likes: 120, shares: 30, comments: 12, views: 4000 },
            { postId: 'p2', postType: 'static', datePosted: '2026-03-16', likes: 40, shares: 2, comments: 5, views: 900 },
        ]);
        expect(skipped).toEqual({ count: 0, rows: [] });
    });

    test('columns can come in any order and letter case, and other columns are ignored', () => {
        const { posts } = readPosts(file('Likes,Caption,DATE_POSTED,Post_Type,comments,shares', '7,hello,2026-01-02,Carousel,1,2'));

        expect(posts).toEqual([
            { postId: '1', postType: 'carousel', datePosted: '2026-01-02', likes: 7, shares: 2, comments: 1, views: 0 },
        ]);
    });

    test('views and post_id are optional; an empty views cell is 0; "reel" is accepted', () => {
        const { posts } = readPosts(file('post_type,date_posted,likes,shares,comments,views', 'reel,2026-01-02,1,2,3,', ' REELS , 2026-01-03 , 4 , 5 , 6 , 70 '));

        expect(posts.map((post) => [post.postId, post.postType, post.views])).toEqual([['1', 'reels', 0], ['2', 'reels', 70]]);
    });

    test('a byte order mark, Windows line ends, quoted cells and blank lines are read correctly', () => {
        const text = `﻿"post_type","date_posted","likes","shares","comments","note"\r\n"static","2026-02-01","10","1","2","a note, with a comma"\r\n\r\n"reels","2026-02-02","20","3","4","second ""quoted"" note"\r\n`;

        const { posts, skipped } = readPosts(Buffer.from(text));

        expect(posts.map((post) => [post.postType, post.likes])).toEqual([['static', 10], ['reels', 20]]);
        expect(skipped.count).toBe(0);
    });
});

describe('rows that break a rule are skipped and reported', () => {
    test('each reason, with the line it is on', () => {
        const { posts, skipped } = readPosts(file(
            HEADER,
            'a,story,2026-03-15,1,1,1,1',
            'b,reels,15-03-2026,1,1,1,1',
            'c,reels,2026-02-31,1,1,1,1',
            'd,reels,2026-03-15,"1,200",1,1,1',
            'e,reels,2026-03-15,1,12.5,1,1',
            'f,reels,2026-03-15,1,1,-3,1',
            'g,reels,2026-03-15,1,1,1,1e3',
            'h,reels,2026-03-15,,1,1,1',
            'i,reels,2026-03-15,1,1,1,1',
        ));

        expect(posts.map((post) => post.postId)).toEqual(['i']);
        expect(skipped.count).toBe(8);
        expect(skipped.rows).toEqual([
            { line: 2, reason: 'post_type must be reels, carousel or static' },
            { line: 3, reason: 'date_posted must be a date like 2026-03-15' },
            { line: 4, reason: 'date_posted must be a date like 2026-03-15' },
            { line: 5, reason: 'likes must be a whole number, 0 or more' },
            { line: 6, reason: 'shares must be a whole number, 0 or more' },
            { line: 7, reason: 'comments must be a whole number, 0 or more' },
            { line: 8, reason: 'views must be a whole number, 0 or more' },
            { line: 9, reason: 'likes must be a whole number, 0 or more' },
        ]);
    });

    test('no stored number is ever NaN or beyond what can be counted exactly', () => {
        const { posts, skipped } = readPosts(file(HEADER, 'a,reels,2026-03-15,99999999999999999999,1,1,1', 'b,reels,2026-03-15,0,0,0,0'));

        expect(skipped.count).toBe(1);
        for (const post of posts) {
            for (const key of ['likes', 'shares', 'comments', 'views']) {
                expect(Number.isSafeInteger(post[key])).toBe(true);
            }
        }
    });

    test('only the first 20 skipped rows are listed, but all are counted', () => {
        const bad = Array.from({ length: 25 }, (_, index) => `x${index},story,2026-03-15,1,1,1,1`);

        const { skipped } = readPosts(file(HEADER, ...bad, 'ok,reels,2026-03-15,1,1,1,1'));

        expect(skipped.count).toBe(25);
        expect(skipped.rows).toHaveLength(20);
        expect(skipped.rows[19].line).toBe(21);
    });

    test('a row with too few or too many cells is skipped, not a refusal of the file', () => {
        const { posts, skipped } = readPosts(file(HEADER, 'a,reels,2026-03-15,1', 'b,reels,2026-03-15,1,1,1,1,extra,cells', 'c,reels,2026-03-15,1,1,1,1'));

        expect(posts.map((post) => post.postId)).toContain('c');
        expect(posts.length + skipped.count).toBe(3);
    });
});

describe('files that are refused', () => {
    test('an empty file', () => {
        expect(refusal(Buffer.from(''))).toEqual({ status: 400, message: 'The file is empty' });
        expect(refusal(Buffer.from('  \n \n'))).toEqual({ status: 400, message: 'The file is empty' });
    });

    test('a file without the header row', () => {
        expect(refusal(file('p1,reels,2026-03-15,120,30,12,4000'))).toEqual({
            status: 400, message: 'The file needs a header row with: post_type, date_posted, likes, shares, comments',
        });
    });

    test('a missing column is named', () => {
        expect(refusal(file('post_type,date_posted,likes,comments', 'reels,2026-03-15,1,1'))).toEqual({ status: 400, message: 'Missing column: shares' });
    });

    test('more rows than allowed', () => {
        const rows = Array.from({ length: MAX_ROWS + 1 }, () => 'reels,2026-03-15,1,1,1');

        expect(refusal(file('post_type,date_posted,likes,shares,comments', ...rows))).toEqual({ status: 400, message: 'The file has more than 2000 rows' });
        expect(readPosts(file('post_type,date_posted,likes,shares,comments', ...rows.slice(1))).posts).toHaveLength(MAX_ROWS);
    });

    test('a file with no valid row', () => {
        expect(refusal(file(HEADER, 'a,story,2026-03-15,1,1,1,1'))).toEqual({ status: 400, message: 'No valid rows were found in the file' });
        expect(refusal(file(HEADER))).toEqual({ status: 400, message: 'No valid rows were found in the file' });
    });

    test('something that is not CSV', () => {
        const binary = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00, 0x01, 0x02, 0xff, 0xfe]);
        expect(refusal(binary)).toEqual({ status: 400, message: 'The file could not be read as CSV' });
        expect(refusal(file(HEADER, 'a,reels,"2026-03-15,1,1,1,1'))).toEqual({ status: 400, message: 'The file could not be read as CSV' });
    });
});
