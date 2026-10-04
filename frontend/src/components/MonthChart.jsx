import { Line } from "react-chartjs-2";
import { cartesianOptions } from "../lib/charts";
import { monthLabel } from "../lib/format";

const MEASURES = [
  { key: "likes", label: "Likes", color: "#f97316" },
  { key: "shares", label: "Shares", color: "#6b21a8" },
  { key: "comments", label: "Comments", color: "#2563eb" },
];

// likes, shares and comments month by month, oldest first as the server sends them
const MonthChart = ({ byMonth }) => {
  const data = {
    labels: byMonth.map((row) => monthLabel(row.month)),
    datasets: MEASURES.map((measure) => ({
      label: measure.label,
      data: byMonth.map((row) => row[measure.key]),
      borderColor: measure.color,
      backgroundColor: measure.color,
      tension: 0.25,
    })),
  };

  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow-lg">
      <div className="h-72 md:h-96">
        <Line data={data} options={cartesianOptions({ xTitle: "Month", yTitle: "Total in the month" })} />
      </div>
      {byMonth.length === 1 && (
        <p className="mt-2 text-sm text-gray-500 text-center">All posts are from one month, so there is no development to show yet.</p>
      )}
    </div>
  );
};

export default MonthChart;
