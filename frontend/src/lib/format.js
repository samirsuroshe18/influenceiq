export const TYPE_LABELS = { reels: 'Reels', carousel: 'Carousel', static: 'Static' };
export const TYPE_COLORS = { reels: '#2563eb', carousel: '#6b21a8', static: '#f97316' };

export const number = (value) => Number(value || 0).toLocaleString('en-US');

// an engagement rate, which the server leaves empty when nothing was viewed
export const rate = (value) => (value === null || value === undefined ? 'n/a' : `${Number(value).toFixed(1)}%`);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "2026-03" as "Mar 2026"
export const monthLabel = (month) => {
  const [year, index] = month.split('-').map(Number);
  return `${MONTHS[index - 1]} ${year}`;
};

// "2026-03-15" as "15 Mar 2026", the same in every time zone
export const dayLabel = (day) => {
  const [year, month, date] = day.split('-').map(Number);
  return `${date} ${MONTHS[month - 1]} ${year}`;
};

export const dateLabel = (value) => new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
