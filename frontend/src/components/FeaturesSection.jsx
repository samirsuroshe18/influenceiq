import React from "react";
import { FaChartBar, FaRobot, FaClock, FaBolt } from "react-icons/fa";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const FeaturesSection = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    fullScreen: { enable: false }, // Keep particles within the section
    background: { color: { value: "#000" } },
    fpsLimit: 60,
    particles: {
      color: { value: "#ffffff" },
      links: { color: "#ffffff", distance: 120, enable: true, opacity: 0.5, width: 1 },
      move: { enable: true, speed: 1.5 },
      number: { density: { enable: true, area: 800 }, value: 40 },
      opacity: { value: 0.6 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 4 } },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { quantity: 4 },
      },
    },
    detectRetina: true,
  };

  return (
    <section className="relative bg-black text-white py-16 px-8 overflow-hidden">
      {/* Background Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0 z-0"
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">
          Speciality
        </h2>
        <h3 className="text-4xl font-bold mb-6">
          Our <span className="text-blue-500">Features</span>
        </h3>
        <p className="text-gray-300 mb-12 max-w-2xl mx-auto">
          Explore the features that make monitoring and improving your social media performance seamless and efficient.
        </p>

        {/* Features Grid */}
        <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <motion.div
            className="p-6 bg-[#0f0f11] rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <FaChartBar className="text-blue-500 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-bold mb-2">View Analytics</h4>
            <p className="text-gray-400">
              Monitor performance metrics across all your posts, including likes, shares, and comments.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="p-6 bg-[#0f0f11] rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <FaRobot className="text-purple-500 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-bold mb-2">AI-Powered Insights</h4>
            <p className="text-gray-400">
              Leverage AI to gain actionable insights and strategies tailored to improve your social media engagement.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="p-6 bg-[#0f0f11] rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <FaClock className="text-yellow-500 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-bold mb-2">Real-Time Monitoring</h4>
            <p className="text-gray-400">
              Stay updated with real-time metrics to make data-driven decisions on the go.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            className="p-6 bg-[#0f0f11] rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <FaBolt className="text-green-500 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-bold mb-2">Fast & Intuitive</h4>
            <p className="text-gray-400">
              Experience a fast, intuitive interface that makes analyzing social media performance effortless.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
