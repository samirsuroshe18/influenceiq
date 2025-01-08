import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PostTypeBarChart = ({ data }) => {
  const { staticData, reelsData, carouselData } = data; // Destructure the required fields

  // Data for the bar chart (likes, shares, comments for each post type)
  const postData = {
    labels: ["Static", "Carousel", "Reel"], // Labels for each post type
    datasets: [
      {
        label: "Likes",
        data: [
          staticData?.totalLikes,
          carouselData?.totalLikes,
          reelsData?.totalLikes,
        ], 
        backgroundColor: "#f97316", // Warm orange for Likes
        borderColor: "#ffffff",
        borderWidth: 1,
      },
      {
        label: "Shares",
        data: [
          staticData?.totalShares,
          carouselData?.totalShares,
          reelsData?.totalShares,
        ], 
        backgroundColor: "#6b21a8", // Rich purple for Shares
        borderColor: "#ffffff",
        borderWidth: 1,
      },
      {
        label: "Comments",
        data: [
          staticData?.totalComments,
          carouselData?.totalComments,
          reelsData?.totalComments,
        ], 
        backgroundColor: "#2563eb", // Bright blue for Comments
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 20,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "#f9f9f9",
        titleColor: "#1f2937",
        bodyColor: "#333",
        borderColor: "#ddd",
        borderWidth: 1,
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            return `${tooltipItem.dataset.label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Post Type",
          color: "#4b5563",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        grid: {
          color: "#e5e7eb",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Interactions",
          color: "#4b5563",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        beginAtZero: true,
        grid: {
          color: "#e5e7eb",
        },
      },
    },
    barThickness: 35, // Adjusted for visual balance
    layout: {
      padding: {
        top: 30, // More space between chart and legend
      },
    },
    maintainAspectRatio: false, // Allows changing height and width without affecting aspect ratio
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">

      {/* Bar Chart with increased height and width */}
      <div className="w-96 h-96" >
        <Bar data={postData} options={options} />
      </div>
    </div>
  );
};

export default PostTypeBarChart;
