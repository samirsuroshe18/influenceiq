# InfluenceIQ: design of the completed app

InfluenceIQ shows how the posts of a social media account perform, and answers
questions about them. It began as a personal project of the team in January
2025. This document describes the completed version.

## 1. Where the project started

The first version had a landing page, an analytics page and an insights
page, and a small server. Its posts came from an Astra DB database and its
answers from a flow on the hosted Langflow service. To become a complete app
it still needed:

- a database and an assistant of its own: the hosted Langflow service was
  shut down in April 2026, and free Astra databases are paused and later
  deleted when nobody uses them
- the assistant called by the server, not by the browser
- figures calculated by the server, with an error state on the pages
- a conversation on the insights page, and answers that always have a shape
  the page can show
- dates on the chart by date, and numbers sorted as numbers in the table
- tests

## 2. What the completed app does

A visitor opens the app and sees the analytics of a sample account straight
away. They can upload a CSV file of their own posts and see the same analytics
for it, and ask questions about whichever dataset is on screen. There are no
accounts.

### Decisions

| Topic | Decision |
|---|---|
| Database | MongoDB (Atlas), database `influenceiq` |
| Assistant | Google Gemini, called by the server. Model from `GEMINI_MODEL`, default `gemini-3.5-flash-lite` |
| Data | A sample dataset, plus CSV upload without login |
| Look | The dark look of the first version is kept |
| Out of scope | Accounts, saved datasets, connecting to real social media accounts, email |

The README says that the first version used Astra DB and Langflow and why
they were replaced.

## 3. Data

### A post

| Field | Rule |
|---|---|
| `postId` | Text, optional in a CSV; numbered from 1 when missing |
| `postType` | `reels`, `carousel` or `static` (a CSV may also say `reel`; case does not matter) |
| `datePosted` | A calendar day, `YYYY-MM-DD` |
| `likes`, `shares`, `comments` | Whole numbers, 0 or more |
| `views` | Whole number, 0 or more; optional in a CSV, 0 when missing |

### A dataset

`{ token, name, isSample, posts[], createdAt, expiresAt }`. The posts are kept
inside the dataset document.

- The **sample dataset** has the fixed id `sample`: about 150 posts over the
  last six months, in the three types, with reels getting the most views and
  carousels the most shares, so the figures have something to say. It is
  rebuilt when the server starts and never expires. The dates are counted
  back from the day of the rebuild, so the sample never looks old.
- An **uploaded dataset** gets a random id of 32 hex characters. Knowing the
  id is what lets a visitor read it; the browser remembers it for as long as
  the upload exists, also while the visitor looks at the sample. It is deleted
  automatically 7 days after the upload, and the visitor can remove it
  earlier.

### CSV upload

- A `.csv` file of at most 1 MB with a header row. Columns, in any order and
  any letter case: `post_type`, `date_posted`, `likes`, `shares`, `comments`,
  and optionally `views` and `post_id`. Other columns are ignored.
- The file is refused, with a message that names the reason, when it is not a
  CSV, is too large, has no header or lacks a required column, has more than
  2,000 data rows, more than 50 columns or a line of more than 20,000
  characters, or has no valid row.
- A number has at most 12 digits. A `post_id` is cut to 40 characters.
- A row that breaks a rule is skipped. The answer lists the skipped rows by
  line number and reason (the first 20) and says how many were skipped in
  all.
- The dataset is named after the file, without its extension, cut to 60
  characters.
- The page offers the sample dataset as a CSV download, as an example of the
  format.

## 4. Figures

The server calculates everything; the browser only draws it.

| Figure | Meaning |
|---|---|
| Totals | Number of posts; sums of likes, shares, comments and views |
| By type | For each of the three types: number of posts, sums, and averages per post of likes, shares, comments and views |
| Engagement rate | (likes + shares + comments) ÷ views, as a percentage with one decimal; shown as "n/a" when the views are 0. Given for the whole dataset and for each type |
| By month | For each calendar month that has posts, oldest first: number of posts and sums of likes, shares, comments and views |
| Top posts | The five posts with the most likes + shares + comments |
| Posts | Every post, for the table |

Averages are rounded to one decimal. A type with no posts has zeros, not a
missing entry.

## 5. Pages

| Page | Content |
|---|---|
| Home | As now: hero and features. The links lead to Analytics and Insights |
| Analytics | Which dataset is shown, with "Upload your CSV", "Download sample CSV" and, for an upload, "Show the sample" (and "Back to my upload" from there) and "Remove my data". Count cards, the type charts, engagement by month (a real date axis), top posts, and the table (sorted as numbers and dates, ten per page) |
| Insights | A conversation about the dataset on screen: the questions and answers of this visit, a box to ask, suggested questions to start from, and how many questions are left today. An answer has text, up to five key points and, when it helps, one chart |
| About | The team, as now |
| Not found | As now |

Every page that loads data has a loading state, an empty state and an error
state with a way to try again. If the remembered upload no longer exists, the
page says so and goes back to the sample. The profile popup in the top bar
shows the dataset in use instead of a made-up account. The layout works on a
phone without sideways scrolling.

## 6. The assistant

- The server sends Gemini the figures of section 4 for the dataset (not the
  raw table), the last six turns of the conversation and the question.
- The instructions tell it to answer only from those figures, to say so when
  the figures cannot answer the question, and to treat the question as a
  question, never as instructions.
- The answer must fit a fixed shape, enforced with a response schema:
  `{ text, insights: string[] (at most 5), chart: null | { type: "bar" | "line", title, labels: string[], series: [{ label, data: number[] }] } }`.
  A chart whose series do not match its labels is dropped; the text is still
  shown.
- A question is 1 to 500 characters.
- One call has 30 seconds. If Gemini cannot be reached or is too slow, the
  visitor gets "The assistant is not available right now. Please try again."
  and the question does not count against the limit. If Gemini answered with
  something that cannot be shown, the message is the same and the question
  does count, because the model was asked.
- Without `GEMINI_API_KEY` the server answers that the assistant is not set
  up, and the page says the same; the analytics work regardless.

### Limits

| Limit | Value | Setting |
|---|---|---|
| Questions per visitor per day | 20 | `DAILY_QUESTION_LIMIT` |
| Questions for the whole site per day | 300 | `SITE_QUESTION_LIMIT` |
| Uploads per visitor per hour | 10 | `UPLOAD_RATE_LIMIT` |

A day is a UTC day. A visitor is recognised by the address the request came
from; the server sits behind the web app's proxy and the host's, and reads the
address accordingly. That address is forwarded by the proxies, so a caller who
goes around the web app can make it up. Each limit is therefore also kept, ten
times wider, for the address the request really arrived from. The question
counts are kept in the database, so a restart does not reset them.

## 7. API

All routes are under `/api/v1` and answer
`{ statusCode, data, message, success }`.

| Route | Purpose |
|---|---|
| `GET /health` | The server is up |
| `GET /datasets/sample.csv` | The sample dataset as a CSV file |
| `POST /datasets` | Upload a CSV (form field `file`). Answers `{ dataset: { id, name, postCount, expiresAt }, skipped: { count, rows: [{ line, reason }] } }` |
| `GET /datasets/:id/analytics` | `{ dataset, totals, byType, byMonth, topPosts, posts }` for `sample` or an upload |
| `DELETE /datasets/:id` | Remove an upload. The sample cannot be removed |
| `POST /datasets/:id/questions` | `{ question, history? }` → `{ answer: { text, insights, chart }, remaining }` |

An id that is neither `sample` nor an existing upload gives 404. Errors carry
a message written for the visitor; unexpected failures say only "Internal
server error".

## 8. Structure

```
backend/
  src/
    app.js, index.js
    controllers/   dataset, question
    models/        dataset, usage
    analysis/      csv (reading a file), figures (section 4), sample (the sample dataset)
    assistant/     gemini (the call), prompt (what is sent), answer (checking what comes back)
    middlewares/   upload, rate limits
    utils/
  tests/
frontend/
  src/
    api/           requests to the server
    lib/           the remembered dataset id
    components/, pages/
docs/design.md
```

The web app calls `/api` on its own address; the dev server and the host
forward it to the server.

## 9. Settings

`backend/.env`: `MONGODB_URI`, `PORT`, `SERVER_HOST`, `CORS_ORIGIN`,
`GEMINI_API_KEY`, `GEMINI_MODEL`, and optionally the three limits of
section 6. The web app needs none.

## 10. Testing

Server tests run against an in-memory database and never call Gemini; the
call is replaced by a stand-in. They cover reading CSV files (every refusal
and every skipped-row reason), the figures (with numbers checked by hand),
the routes, the limits, the checks on the assistant's answer, and that the
sample dataset is rebuilt without touching uploads.

The web app is checked by building it, linting it and walking through every
page in a browser, on a desktop and a phone width, with the sample, with an
upload, with a broken file and with the assistant unavailable.

## 11. Deployment

Server on Render, web app on Vercel, database on MongoDB Atlas, as in the
other projects. `frontend/vercel.json` forwards `/api` to the server.
