import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PostTypeBarChart = () => {
  // Data for the bar chart (like, share, and comment data for each post type)
  const postData = {
    labels: ['Static', 'Carousel', 'Reel'], // Labels for each post type
    datasets: [
      {
        label: 'Likes',
        data: [150, 200, 180], // Likes data for Static, Carousel, Reel
        backgroundColor: '#f97316', // Orange for Likes
        borderColor: '#ffffff',
        borderWidth: 1,
      },
      {
        label: 'Shares',
        data: [100, 120, 110], // Shares data for Static, Carousel, Reel
        backgroundColor: '#6b21a8', // Purple for Shares
        borderColor: '#ffffff',
        borderWidth: 1,
      },
      {
        label: 'Comments',
        data: [90, 80, 110], // Comments data for Static, Carousel, Reel
        backgroundColor: '#2563eb', // Blue for Comments
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
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
          text: 'Post Type',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Interactions',
        },
        beginAtZero: true,
      },
    },
    barThickness: 30, // Adjusting bar thickness for better visual appeal
    layout: {
      padding: {
        top: 20, // Ensures spacing between chart and legend
      },
    },
  };

  return (
    <div className="flex flex-col items-center">
      {/* Legend (Custom labels for Like, Share, Comment) */}
      <div className="text-center text-lg font-medium space-x-6 mb-6">
        <span className="text-orange-500">Likes</span>
        <span className="text-purple-700">Shares</span>
        <span className="text-blue-600">Comments</span>
      </div>

      {/* Bar Chart */}
      <Bar data={postData} options={options} />
    </div>
  );
};

export default PostTypeBarChart;
