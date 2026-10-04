import api, { unwrap } from './client.js';

export const SAMPLE_CSV_URL = '/api/v1/datasets/sample.csv';

// { dataset, totals, byType, byMonth, topPosts, posts }
export const getAnalytics = async (id) => unwrap(await api.get(`/datasets/${id}/analytics`)).data;

// answers { data: { dataset, skipped }, message }
export const uploadDataset = async (file) => {
  const body = new FormData();
  body.append('file', file);

  return unwrap(await api.post('/datasets', body));
};

export const removeDataset = async (id) => unwrap(await api.delete(`/datasets/${id}`));

// history: [{ role: 'user' | 'assistant', text }]; answers { answer, remaining }
export const askQuestion = async (id, question, history) =>
  unwrap(await api.post(`/datasets/${id}/questions`, { question, history })).data;
