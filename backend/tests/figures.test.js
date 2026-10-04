import { figuresOf } from '../src/analysis/figures.js';

let counter = 0;
const post = (postType, datePosted, likes, shares, comments, views) => {
    counter += 1;
    return { postId: `p${counter}`, postType, datePosted, likes, shares, comments, views };
};

const posts = [
    post('reels', '2026-01-10', 100, 20, 10, 1000),
    post('reels', '2026-02-05', 50, 5, 5, 500),
    post('reels', '2026-02-20', 25, 0, 0, 250),
    post('static', '2026-01-15', 10, 1, 1, 100),
    post('static', '2026-03-01', 30, 2, 4, 0),
];

describe('totals', () => {
    test('sums over every post and the engagement rate of the whole dataset', () => {
        const { totals } = figuresOf(posts);

        // engagement: (215 + 28 + 20) / 1850 = 14.216...%
        expect(totals).toEqual({ posts: 5, likes: 215, shares: 28, comments: 20, views: 1850, engagementRate: 14.2 });
    });

    test('no posts at all', () => {
        const figures = figuresOf([]);

        expect(figures.totals).toEqual({ posts: 0, likes: 0, shares: 0, comments: 0, views: 0, engagementRate: null });
        expect(figures.byMonth).toEqual([]);
        expect(figures.topPosts).toEqual([]);
        expect(figures.byType.map((row) => row.posts)).toEqual([0, 0, 0]);
    });
});

describe('by type', () => {
    test('always the three types, in the same order', () => {
        expect(figuresOf(posts).byType.map((row) => row.type)).toEqual(['reels', 'carousel', 'static']);
    });

    test('sums, averages to one decimal and the rate of each type', () => {
        const [reels, carousel, fixed] = figuresOf(posts).byType;

        // reels: likes 175 / 3 = 58.33, shares 25 / 3 = 8.33, comments 15 / 3 = 5, views 1750 / 3 = 583.33
        // rate: (175 + 25 + 15) / 1750 = 12.285...%
        expect(reels).toEqual({
            type: 'reels', posts: 3, likes: 175, shares: 25, comments: 15, views: 1750,
            averages: { likes: 58.3, shares: 8.3, comments: 5, views: 583.3 },
            engagementRate: 12.3,
        });

        expect(carousel).toEqual({
            type: 'carousel', posts: 0, likes: 0, shares: 0, comments: 0, views: 0,
            averages: { likes: 0, shares: 0, comments: 0, views: 0 },
            engagementRate: null,
        });

        // static: (40 + 3 + 5) / 100 = 48%
        expect(fixed).toMatchObject({ posts: 2, likes: 40, views: 100, averages: { likes: 20, shares: 1.5, comments: 2.5, views: 50 }, engagementRate: 48 });
    });

    test('a rate is not given when nothing was viewed', () => {
        const [, , fixed] = figuresOf([post('static', '2026-03-01', 30, 2, 4, 0)]).byType;

        expect(fixed.engagementRate).toBeNull();
    });
});

describe('by month', () => {
    test('one entry for each month that has posts, oldest first', () => {
        const shuffled = [posts[4], posts[1], posts[0], posts[3], posts[2]];

        expect(figuresOf(shuffled).byMonth).toEqual([
            { month: '2026-01', posts: 2, likes: 110, shares: 21, comments: 11, views: 1100 },
            { month: '2026-02', posts: 2, likes: 75, shares: 5, comments: 5, views: 750 },
            { month: '2026-03', posts: 1, likes: 30, shares: 2, comments: 4, views: 0 },
        ]);
    });

    test('months of different years stay apart and in order', () => {
        const months = figuresOf([post('reels', '2026-01-01', 1, 0, 0, 1), post('reels', '2025-12-31', 1, 0, 0, 1)]).byMonth;

        expect(months.map((row) => row.month)).toEqual(['2025-12', '2026-01']);
    });
});

describe('top posts', () => {
    test('the five posts with the most likes, shares and comments together', () => {
        const many = [10, 60, 30, 50, 20, 40, 70].map((likes, index) => post('reels', `2026-04-0${index + 1}`, likes, 0, 0, 100));

        const top = figuresOf(many).topPosts;

        expect(top.map((item) => item.likes)).toEqual([70, 60, 50, 40, 30]);
        expect(top[0]).toMatchObject({ postType: 'reels', datePosted: '2026-04-07', engagement: 70 });
    });

    test('equal posts: the more recent one first', () => {
        const older = post('static', '2026-01-01', 5, 5, 0, 10);
        const newer = post('reels', '2026-02-01', 10, 0, 0, 10);

        expect(figuresOf([older, newer]).topPosts.map((item) => item.postId)).toEqual([newer.postId, older.postId]);
    });

    test('the posts given are not changed', () => {
        const before = JSON.stringify(posts);
        figuresOf(posts);

        expect(JSON.stringify(posts)).toBe(before);
    });
});
