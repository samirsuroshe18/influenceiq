import { Dataset } from '../models/dataset.model.js';

export const SAMPLE_TOKEN = 'sample';
const SAMPLE_NAME = 'Sample account';

const DAY_MS = 24 * 60 * 60 * 1000;
const DAYS = 180;

// How each kind of post tends to do: reels are seen the most, carousels are shared
// the most, static posts reach the fewest people but get comments.
const PROFILES = {
    reels: { views: [4000, 12000], likes: [0.06, 0.11], shares: [0.008, 0.016], comments: [0.004, 0.009] },
    carousel: { views: [2000, 5500], likes: [0.05, 0.09], shares: [0.03, 0.06], comments: [0.006, 0.012] },
    static: { views: [800, 2600], likes: [0.04, 0.08], shares: [0.004, 0.01], comments: [0.008, 0.02] },
};

// which kind is posted on which turn: four reels, three carousels and three static posts in ten
const ROTATION = ['reels', 'static', 'carousel', 'reels', 'static', 'reels', 'carousel', 'static', 'reels', 'carousel'];

// A small random number generator with a fixed start, so the sample is the same
// every time it is built.
const generator = (seed) => {
    let state = seed;

    return () => {
        state = (state + 0x6D2B79F5) | 0;
        let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
        mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
        return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
};

const dayOf = (date) => date.toISOString().slice(0, 10);

// The posts of the sample account: about six a week for the last six months, counted
// back from today so the sample never looks old.
const buildSamplePosts = (today = new Date()) => {
    const random = generator(20250105);
    const between = ([low, high]) => low + random() * (high - low);
    const posts = [];

    for (let daysAgo = DAYS; daysAgo >= 0; daysAgo -= 1) {
        // no post on roughly one day in six
        const posted = random() > 0.17;
        if (!posted) continue;

        const postType = ROTATION[posts.length % ROTATION.length];
        const profile = PROFILES[postType];
        // the account grows: recent posts are seen by up to a third more people
        const growth = 1 + (1 - daysAgo / DAYS) * 0.33;
        const views = Math.round(between(profile.views) * growth);

        posts.push({
            postId: `P${String(posts.length + 1).padStart(3, '0')}`,
            postType,
            datePosted: dayOf(new Date(today.getTime() - daysAgo * DAY_MS)),
            likes: Math.round(views * between(profile.likes)),
            shares: Math.round(views * between(profile.shares)),
            comments: Math.round(views * between(profile.comments)),
            views,
        });
    }

    return posts;
};

// Puts the sample dataset in place, replacing the previous one. Uploads are not touched.
const ensureSample = async (today = new Date()) => {
    await Dataset.findOneAndUpdate(
        { token: SAMPLE_TOKEN },
        { $set: { name: SAMPLE_NAME, isSample: true, posts: buildSamplePosts(today) }, $unset: { expiresAt: '' } },
        { upsert: true }
    );
};

export { buildSamplePosts, ensureSample }
