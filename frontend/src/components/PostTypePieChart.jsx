import { Pie } from "react-chartjs-2";
import { TYPE_COLORS, TYPE_LABELS } from "../lib/format";

// how the posts divide over the three types; byType is what the server calculated
const PostTypePieChart = ({ byType }) => {
  const data = {
    labels: byType.map((row) => TYPE_LABELS[row.type]),
    datasets: [
      {
        label: "Posts",
        data: byType.map((row) => row.posts),
        backgroundColor: byType.map((row) => TYPE_COLORS[row.type]),
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { boxWidth: 16, padding: 14 } },
      tooltip: {
        callbacks: {
          label: (item) => {
            const total = item.dataset.data.reduce((sum, value) => sum + value, 0);
            const share = total > 0 ? ((item.raw / total) * 100).toFixed(1) : "0.0";
            return `${item.label}: ${item.raw} posts (${share}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md p-4 md:p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Posts by type</h3>
      <div className="h-72 md:h-80">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default PostTypePieChart;
