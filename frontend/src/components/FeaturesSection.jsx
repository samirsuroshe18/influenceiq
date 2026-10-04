import { FaChartBar, FaRobot, FaFileUpload, FaBolt } from "react-icons/fa";
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
    <section className="relative bg-black text-white py-16 px-4 md:px-8 overflow-hidden">
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
          Our <span className="text-purple-500">Features</span>
        </h3>
        <p className="text-gray-300 mb-12 max-w-2xl mx-auto">
          What you can do with InfluenceIQ.
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
              Totals, averages and engagement rates for every post type, month by month, with your best posts on top.
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
              Ask questions in plain words. The answers come from your own figures, with a chart when it helps.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="p-6 bg-[#0f0f11] rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <FaFileUpload className="text-yellow-500 text-4xl mb-4 mx-auto" />
            <h4 className="text-xl font-bold mb-2">Bring Your Own Data</h4>
            <p className="text-gray-400">
              Upload a CSV of your posts and see the same analytics for them. No account needed.
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
              One page of figures and one conversation. Nothing to set up, and it works on a phone.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
