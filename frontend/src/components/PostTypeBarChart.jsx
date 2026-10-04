import { Bar } from "react-chartjs-2";
import { cartesianOptions } from "../lib/charts";
import { TYPE_LABELS } from "../lib/format";

const MEASURES = [
  { key: "likes", label: "Likes", color: "#f97316" },
  { key: "shares", label: "Shares", color: "#6b21a8" },
  { key: "comments", label: "Comments", color: "#2563eb" },
];

// what an average post of each type gets; byType is what the server calculated
const PostTypeBarChart = ({ byType }) => {
  const data = {
    labels: byType.map((row) => TYPE_LABELS[row.type]),
    datasets: MEASURES.map((measure) => ({
      label: measure.label,
      data: byType.map((row) => row.averages[measure.key]),
      backgroundColor: measure.color,
    })),
  };

  return (
    <div className="w-full max-w-md p-4 md:p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Average per post</h3>
      <div className="h-72 md:h-80">
        <Bar data={data} options={cartesianOptions({ xTitle: "Post type", yTitle: "Average per post" })} />
      </div>
    </div>
  );
};

export default PostTypeBarChart;
