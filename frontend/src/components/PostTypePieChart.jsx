import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registering the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PostTypePieChart = ({ data }) => {
  const { statics, reels, carousel } = data; // Destructure the required fields

  // Data for the pie chart (static, carousel, and reel posts)
  const postData = {
    labels: ["Static", "Carousel", "Reel"], // Labels for each post type
    datasets: [
      {
        label: "Post Type Distribution",
        data: [statics, carousel, reels], // Example data: static = 40, carousel = 30, reel = 30
        backgroundColor: ["#f97316", "#6b21a8", "#2563eb"], // Colors for each segment
        borderColor: ["#ffffff", "#ffffff", "#ffffff"], // Border color for each segment
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 2000, // 2 seconds for animation
      animateRotate: true,
      animateScale: true,
    },
    plugins: {
      legend: {
        position: "top", // Legend appears on top
        labels: {
          boxWidth: 20, // Width of the legend box
          padding: 15, // Space between legend items
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            const total = tooltipItem.dataset.data.reduce(
              (acc, val) => acc + val,
              0
            );
            const percentage = ((value / total) * 100).toFixed(2);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return (
    <div>
      {/* Adding margin only for the pie chart */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        {/* Pie Chart with increased height and width */}
        <div className="w-96 h-96">
          <Pie data={postData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default PostTypePieChart;
