import React from "react";
import { FaChartLine, FaBrain, FaEye, FaBolt } from "react-icons/fa";

const FeaturesSection = () => {
  return (
    <section className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Why Choose Social Media Analyzer?</h2>
        <p className="text-gray-400 text-lg mb-12">
          Uncover actionable insights, boost your engagement, and stay ahead with our advanced analytics tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <FaChartLine size={50} className="text-blue-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">View Analytics</h3>
            <p className="text-gray-400">
              Monitor performance metrics across all your posts, including likes, shares, and comments.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <FaBrain size={50} className="text-purple-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">AI-Powered Insights</h3>
            <p className="text-gray-400">
              Leverage AI to gain actionable insights and strategies tailored to improve your social media engagement.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <FaEye size={50} className="text-green-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Real-Time Monitoring</h3>
            <p className="text-gray-400">
              Stay updated with real-time metrics to make data-driven decisions on the go.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
            <FaBolt size={50} className="text-yellow-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Fast & Intuitive</h3>
            <p className="text-gray-400">
              Experience a fast, intuitive interface that makes analyzing social media performance effortless.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
