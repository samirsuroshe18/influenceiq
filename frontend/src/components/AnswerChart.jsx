import { Bar, Line } from "react-chartjs-2";
import { cartesianOptions, SERIES_COLORS } from "../lib/charts";

// The chart that came with an answer. The server has already checked that every
// series has one number for each label.
const AnswerChart = ({ chart }) => {
  const Chart = chart.type === "line" ? Line : Bar;

  const data = {
    labels: chart.labels,
    datasets: chart.series.map((series, index) => ({
      label: series.label || "Value",
      data: series.data,
      backgroundColor: SERIES_COLORS[index % SERIES_COLORS.length],
      borderColor: SERIES_COLORS[index % SERIES_COLORS.length],
      tension: 0.25,
    })),
  };

  return (
    <div className="mt-3 p-3 md:p-4 bg-white rounded-lg">
      {chart.title && <h4 className="text-sm md:text-base font-semibold text-gray-800 text-center mb-2">{chart.title}</h4>}
      <div className="h-56 md:h-72">
        <Chart data={data} options={cartesianOptions()} />
      </div>
    </div>
  );
};

export default AnswerChart;
