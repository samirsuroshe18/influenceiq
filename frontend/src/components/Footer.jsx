import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "../assets/cropped.png";

const Footer = () => {
  return (
    <footer className="bg-[#0f0f11] text-white py-8">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left side */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src={Logo}
                alt="InfluenceIQ Logo"
                className="w-12 h-12"
              />
              <span className="text-3xl">
                Influence <sup>IQ</sup>
              </span>
            </div>
            <p className="text-lg font-medium text-center md:text-left">
              Empowering innovation through AI-driven solutions.
            </p>
          </div>

          {/* Right side */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <nav>
              <ul className="flex flex-wrap justify-center md:justify-end gap-6">
                <li>
                  <Link to="/about" className="text-white hover:text-gray-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white hover:text-gray-400 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-white hover:text-gray-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-white hover:text-gray-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm">Email: hackhorizon8@gmail.com</p>
            <p className="text-sm">
              © 2025 Influence<sup>IQ</sup> All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;