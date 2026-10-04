import asyncHandler from '../utils/asynchandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { figuresOf } from '../analysis/figures.js';
import { generateJson, assistantReady } from '../assistant/gemini.js';
import { ANSWER_SCHEMA, buildPrompt } from '../assistant/prompt.js';
import { cleanAnswer } from '../assistant/answer.js';
import { take, giveBack } from '../utils/dailyLimit.js';
import { visitorOf } from '../utils/visitor.js';
import { findDataset, postsOf } from './dataset.controller.js';

const QUESTION_MAX = 500;
const TURNS_KEPT = 6;
const TURN_MAX = 1000;
const ROLES = ['user', 'assistant'];

const SITE_KEY = 'site';

const visitorLimit = () => Number(process.env.DAILY_QUESTION_LIMIT) || 20;
const siteLimit = () => Number(process.env.SITE_QUESTION_LIMIT) || 300;

const readQuestion = (value) => {
    const question = typeof value === 'string' ? value.trim() : '';

    if (!question || question.length > QUESTION_MAX) {
        throw new ApiError(400, `Ask a question of at most ${QUESTION_MAX} characters`);
    }

    return question;
};

// the conversation so far, as the page sent it: only well-formed turns, only the last few
const readHistory = (value) => (Array.isArray(value) ? value : [])
    .filter((turn) => turn && ROLES.includes(turn.role) && typeof turn.text === 'string' && turn.text.trim())
    .slice(-TURNS_KEPT)
    .map((turn) => ({ role: turn.role, text: turn.text.trim().slice(0, TURN_MAX) }));

const askQuestion = asyncHandler(async (req, res) => {
    const dataset = await findDataset(req.params.id);
    const question = readQuestion(req.body?.question);
    const history = readHistory(req.body?.history);

    if (!assistantReady()) {
        throw new ApiError(503, "The assistant is not set up on this server");
    }

    const visitorKey = `visitor:${visitorOf(req)}`;

    // the visitor's own allowance first: someone at their limit does not use up the site's
    const remaining = await take(visitorKey, visitorLimit());
    if (remaining === null) {
        throw new ApiError(429, `You have used today's ${visitorLimit()} questions. Please come back tomorrow.`);
    }

    if (await take(SITE_KEY, siteLimit()) === null) {
        await giveBack(visitorKey);
        throw new ApiError(429, "The assistant has answered its questions for today. Please come back tomorrow.");
    }

    let answer;
    try {
        // the figures are sent, not the table of posts
        const figures = figuresOf(postsOf(dataset));
        answer = cleanAnswer(await generateJson(buildPrompt({ name: dataset.name, figures, history, question }), ANSWER_SCHEMA));
    } catch (error) {
        console.log(`The assistant failed: ${error.message}`);
        // a question without an answer is not counted
        await Promise.all([giveBack(visitorKey), giveBack(SITE_KEY)]);
        throw new ApiError(502, "The assistant is not available right now. Please try again.");
    }

    return res.status(200).json(
        new ApiResponse(200, { answer, remaining }, "Answer")
    );
});

export { askQuestion }
