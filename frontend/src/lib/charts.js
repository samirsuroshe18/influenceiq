import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';

// the pieces of Chart.js the app draws with, registered once
ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Title, Tooltip);

export const SERIES_COLORS = ['#7c3aed', '#2563eb', '#f97316', '#16a34a'];

// axes and legend for a chart on a white card
export const cartesianOptions = ({ xTitle, yTitle } = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top', labels: { boxWidth: 16, padding: 14 } } },
  scales: {
    x: { title: { display: Boolean(xTitle), text: xTitle, color: '#4b5563' }, grid: { color: '#e5e7eb' } },
    y: { beginAtZero: true, title: { display: Boolean(yTitle), text: yTitle, color: '#4b5563' }, grid: { color: '#e5e7eb' } },
  },
});
