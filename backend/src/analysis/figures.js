import { POST_TYPES } from './csv.js';

const COUNTS = ['likes', 'shares', 'comments', 'views'];
const TOP_POSTS = 5;

const oneDecimal = (value) => Math.round(value * 10) / 10;

const engagementOf = (post) => post.likes + post.shares + post.comments;

// likes, shares and comments for every hundred views; nothing can be said without views
const rateOf = (sums) => (sums.views > 0 ? oneDecimal(((sums.likes + sums.shares + sums.comments) / sums.views) * 100) : null);

const sumsOf = (posts) => {
    const sums = { posts: posts.length, likes: 0, shares: 0, comments: 0, views: 0 };

    for (const post of posts) {
        for (const name of COUNTS) {
            sums[name] += post[name];
        }
    }

    return sums;
};

const averagesOf = (sums) => Object.fromEntries(
    COUNTS.map((name) => [name, sums.posts > 0 ? oneDecimal(sums[name] / sums.posts) : 0])
);

// a type without posts still has its row, with zeros
const byType = (posts) => POST_TYPES.map((type) => {
    const sums = sumsOf(posts.filter((post) => post.postType === type));

    return { type, ...sums, averages: averagesOf(sums), engagementRate: rateOf(sums) };
});

// one row for each calendar month that has posts, oldest first
const byMonth = (posts) => {
    const months = new Map();

    for (const post of posts) {
        const month = post.datePosted.slice(0, 7);
        months.set(month, [...(months.get(month) || []), post]);
    }

    // months are written as YYYY-MM, so they sort as text
    return [...months.keys()].sort().map((month) => ({ month, ...sumsOf(months.get(month)) }));
};

// the most engaging posts; between equals, the more recent one first
const topPosts = (posts) => posts
    .map((post) => ({ ...post, engagement: engagementOf(post) }))
    .sort((a, b) => b.engagement - a.engagement || b.datePosted.localeCompare(a.datePosted))
    .slice(0, TOP_POSTS);

// Everything the pages show about a dataset, calculated from its posts
const figuresOf = (posts) => {
    const sums = sumsOf(posts);

    return {
        totals: { ...sums, engagementRate: rateOf(sums) },
        byType: byType(posts),
        byMonth: byMonth(posts),
        topPosts: topPosts(posts),
    };
};

export { figuresOf }
