import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "../assets/cropped.png";

const Footer = () => {
  return (
    <footer className="bg-[#0f0f11] text-white py-8">
      
      <div className="container mx-auto px-6 flex ">
        {/* Left side (Logo and Description) */}
        <div className="flex flex-col items-start space-y-4">
          <div className='flex items-center space-x-2 text-center'>
            <img
              src={Logo}
              alt="InfluenceIQ Logo"
              className="w-12 h-12"
            />
            <span className='text-3xl'>Influence <sup>IQ</sup></span>
          </div>
          <p className="text-lg font-medium">
            Empowering innovation through AI-driven solutions.
          </p>
        </div>
        <div className='flex justify-end'>
        <div className="flex flex-col items-center justify-center text-center ">
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 flex gap-6">
            <li>
              <Link to="/about" className="text-white hover:text-gray-400">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-white hover:text-gray-400">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="text-white hover:text-gray-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="text-white hover:text-gray-400">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
      </div> 
      <div className='flex flex-col space-y-2 items-center justify-center'>
        <p className="text-sm">Email: hackhorizon8@gmail.com</p>
        <p className="text-sm mt-4 ">© 2025 Influence<sup className='space-x-2'>IQ</sup> All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
