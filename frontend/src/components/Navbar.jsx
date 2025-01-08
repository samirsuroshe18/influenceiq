import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Modal from 'react-modal';
import { Instagram, ExternalLink, X, Menu } from 'lucide-react'; // Added X and Menu imports
import Logo from "../assets/cropped.png";

Modal.setAppElement('#root');

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // For modal
  const [menuOpen, setMenuOpen] = useState(false); // For hamburger menu

  const userData = {
    username: "hackhorizon.ai",
    name: "Hack Horizon",
    instagramHandle: "@hackhorizon.ai",
    instagramUrl: "https://instagram.com/"
  };

  const getLinkStyle = ({ isActive }) => {
    return isActive
      ? "text-purple-500"
      : "text-white hover:text-purple-500 transition-colors";
  };

  return (
    <>
      <nav className="bg-[#0f0f11] text-white flex justify-between items-center p-4">
        <Link to="/home">
          <div className="text-2xl font-bold flex justify-center items-center space-x-2">
            <img src={Logo} className='w-8 h-8 m-2' />
            <span>Influence <sup className='p-[0.5px]'>IQ</sup></span>
          </div>
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="block md:hidden text-white focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <ul className="hidden md:flex space-x-6 gap-12 text-md">
          <li><NavLink to="/" className={getLinkStyle}>Home</NavLink></li>
          <li><NavLink to="/analytics" className={getLinkStyle}>Analytics</NavLink></li>
          <li><NavLink to="/insights" className={getLinkStyle}>Insights</NavLink></li>
          <li><NavLink to="/about" className={getLinkStyle}>About</NavLink></li>
        </ul>
        <button
          onClick={() => setIsOpen(true)}
          className="hidden md:block bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded text-white"
        >
          Account
        </button>
      </nav>

      {/* Hamburger Menu for Small Screens */}
      <div className="md:hidden">
        {menuOpen && (
          <ul className="bg-[#0f0f11] text-white space-y-2 p-4">
            <li>
              <NavLink to="/" className="block hover:text-purple-500">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/analytics" className="block hover:text-purple-500">
                Analytics
              </NavLink>
            </li>
            <li>
              <NavLink to="/insights" className="block hover:text-purple-500">
                Insights
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="block hover:text-purple-500">
                About
              </NavLink>
            </li>
          </ul>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-80 shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          <div className="pt-4 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                {userData.username[0].toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold">{userData.username}</h2>
              <p className="text-gray-600">{userData.name}</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Instagram size={20} className="text-gray-600" />
                <span className="text-gray-800">{userData.instagramHandle}</span>
              </div>
              <a
                href={userData.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-500 hover:text-purple-600"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
