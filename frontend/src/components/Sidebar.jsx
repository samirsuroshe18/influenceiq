import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaChartBar, FaLightbulb, FaBars, FaArrowRight, FaHome } from "react-icons/fa";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`flex flex-col bg-gray-900 text-white h-screen ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h1
          className={`text-xl font-bold ${
            isCollapsed ? "hidden" : "block"
          } transition-all duration-300`}
        >
          Social Analyzer
        </h1>
        <button
          className="text-white focus:outline-none"
          onClick={toggleSidebar}
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex flex-col space-y-2">
        <Link
          to="/dashboard"
          className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaHome size={20} />
          <span
            className={`ml-4 ${
              isCollapsed ? "hidden" : "block"
            } transition-all duration-300`}
          >
            Home
          </span>
        </Link>

        <Link
          to="/dashboard"
          className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaTachometerAlt size={20} />
          <span
            className={`ml-4 ${
              isCollapsed ? "hidden" : "block"
            } transition-all duration-300`}
          >
            Dashboard
          </span>
        </Link>

        <Link
          to="/analytics"
          className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaChartBar size={20} />
          <span
            className={`ml-4 ${
              isCollapsed ? "hidden" : "block"
            } transition-all duration-300`}
          >
            Analytics
          </span>
        </Link>

        <Link
          to="/insights"
          className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaLightbulb size={20} />
          <span
            className={`ml-4 ${
              isCollapsed ? "hidden" : "block"
            } transition-all duration-300`}
          >
            Insights
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
