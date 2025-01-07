import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0f0f11] text-white py-8">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Left side (Logo and Description) */}
        <div className="flex flex-col items-start space-y-4">
          <img
            src="path_to_your_logo.png"
            alt="InfluenceIQ Logo"
            className="max-w-xs mb-4"
          />
          <p className="text-lg font-medium">
            Empowering innovation through AI-driven solutions.
          </p>
        </div>

        {/* Right side (Quick Links and Contact Info) */}
        <div className="flex flex-col items-end space-y-4">
          <div>
            <h4 className="text-xl font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-white hover:text-gray-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white hover:text-gray-400"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-white hover:text-gray-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-white hover:text-gray-400"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm">Email: support@socialpulse.com</p>
            <p className="text-sm mt-4">© 2025 Influence^IQ All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
