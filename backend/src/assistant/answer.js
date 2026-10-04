const TEXT_MAX = 2000;
const INSIGHT_MAX = 300;
const INSIGHTS = 5;
const TITLE_MAX = 80;
const LABEL_MAX = 40;
const MAX_LABELS = 12;
const MAX_SERIES = 4;
const CHART_TYPES = ['bar', 'line'];

const isText = (value) => typeof value === 'string' && value.trim() !== '';
const cut = (value, max) => value.trim().slice(0, max);

const cleanInsights = (insights) => (Array.isArray(insights) ? insights : [])
    .filter(isText)
    .slice(0, INSIGHTS)
    .map((insight) => cut(insight, INSIGHT_MAX));

// A chart is kept only when it can be drawn exactly as it is: a known kind, a few
// labels, and for every series one real number for each label.
const cleanChart = (chart) => {
    if (!chart || typeof chart !== 'object' || Array.isArray(chart)) return null;

    const { type, title, labels, series } = chart;

    if (!CHART_TYPES.includes(type)) return null;
    if (!Array.isArray(labels) || labels.length < 1 || labels.length > MAX_LABELS || !labels.every(isText)) return null;
    if (!Array.isArray(series) || series.length < 1 || series.length > MAX_SERIES) return null;

    const drawable = series.every((one) =>
        one && Array.isArray(one.data) && one.data.length === labels.length && one.data.every(Number.isFinite));

    if (!drawable) return null;

    return {
        type,
        title: isText(title) ? cut(title, TITLE_MAX) : '',
        labels: labels.map((label) => cut(label, LABEL_MAX)),
        series: series.map((one) => ({ label: isText(one.label) ? cut(one.label, LABEL_MAX) : '', data: one.data })),
    };
};

// What the language model sent back, reduced to what the page can show. An answer
// without text is no answer at all; anything else that is wrong is left out.
const cleanAnswer = (raw) => {
    if (!raw || typeof raw !== 'object' || !isText(raw.text)) {
        throw new Error('The assistant gave no answer');
    }

    return {
        text: cut(raw.text, TEXT_MAX),
        insights: cleanInsights(raw.insights),
        chart: cleanChart(raw.chart),
    };
};

export { cleanAnswer }
