import React from "react";
import { motion } from "framer-motion";
import heroImg from "../assets/hero.jpg";

const HeroSection = () => {
  return (
    <section className="bg-gray-900 text-white py-16 px-10 ml-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-center items-center m-4 gap-20">
        {/* Text Content */}
        <motion.div
          className="lg:w-1/2 mb-10 lg:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Empower Your Social Media Strategy
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Unlock actionable insights and analyze your social media performance with ease. 
            Leverage AI-powered tools to make data-driven decisions and maximize engagement.
          </p>
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition">
              Get Started
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-lg transition">
              Learn More
            </button>
          </motion.div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="lg:w-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.img
              src={heroImg}
              alt="Social Media Analytics"
              className="rounded-lg shadow-lg h-96 w-96 object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
