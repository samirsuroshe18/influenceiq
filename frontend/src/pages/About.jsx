import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import Navbar from "../components/Navbar";

const teamMembers = [
  {
    name: "Mohit Dhangar",
    profilePic: "https://via.placeholder.com/150",
    github: "https://github.com/alicejohnson",
    email: "alice@example.com",
  },
  {
    name: "Tanishq Kulkarni",
    profilePic: "https://via.placeholder.com/150",
    github: "https://github.com/bobsmith",
    email: "bob@example.com",
  },
  {
    name: "Samir Suroshe",
    profilePic: "https://via.placeholder.com/150",
    github: "https://github.com/charlielee",
    email: "charlie@example.com",
  },
  {
    name: "Pranay Sanap",
    profilePic: "https://via.placeholder.com/150",
    github: "https://github.com/dianabrown",
    email: "diana@example.com",
  },
];

const About = () => {
  return (
    <>
    <Navbar/>
    <section className="bg-black text-white py-16 px-8 min-h-screen">
      {/* Team Introduction */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold mb-4">
          Meet the Team at <span className="text-purple-400">Hack Horizon</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A group of passionate innovators dedicated to crafting cutting-edge solutions for social media engagement analysis.
        </p>
      </motion.div>

      {/* Team Members Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            {/* Profile Picture */}
            <img
              src={member.profilePic}
              alt={`${member.name} Profile`}
              className="w-24 h-24 rounded-full mb-4 border-4 border-purple-400"
            />

            {/* Name */}
            <h2 className="text-xl font-semibold mb-2">{member.name}</h2>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-purple-500 text-white text-xs py-1 px-3 rounded-full">
                Team Member
              </span>
              <span className="bg-blue-500 text-white text-xs py-1 px-3 rounded-full">
                Developer
              </span>
            </div>

            {/* Links */}
            <div className="flex gap-4">
              {/* GitHub */}
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white text-2xl"
              >
                <FaGithub />
              </a>

              {/* Email */}
              <a
                href={`mailto:${member.email}`}
                className="text-gray-300 hover:text-white text-2xl"
              >
                <FaEnvelope />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
    </>
  );
};

export default About;
