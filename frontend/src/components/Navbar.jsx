import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Modal from 'react-modal';
import { Database, X, Menu } from 'lucide-react';
import Logo from "../assets/cropped.png";
import { useDataset } from '../lib/DatasetContext';

Modal.setAppElement('#root');

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/insights', label: 'Insights' },
  { to: '/about', label: 'About' },
];

const Navbar = () => {
  const { dataset, isSample } = useDataset();
  const [isOpen, setIsOpen] = useState(false); // the dataset popup
  const [menuOpen, setMenuOpen] = useState(false); // the menu on a phone

  const getLinkStyle = ({ isActive }) => {
    return isActive
      ? "text-purple-500"
      : "text-white hover:text-purple-500 transition-colors";
  };

  return (
    <>
      <nav className="bg-[#0f0f11] text-white flex justify-between items-center p-4">
        <Link to="/">
          <div className="text-2xl font-bold flex justify-center items-center space-x-2">
            <img src={Logo} alt="" className='w-8 h-8 m-2' />
            <span>Influence <sup className='p-[0.5px]'>IQ</sup></span>
          </div>
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="block md:hidden text-white focus:outline-none"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <ul className="hidden md:flex gap-12 text-md">
          {LINKS.map((link) => (
            <li key={link.to}><NavLink to={link.to} end className={getLinkStyle}>{link.label}</NavLink></li>
          ))}
        </ul>
        <button
          onClick={() => setIsOpen(true)}
          className="hidden md:block bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded text-white"
        >
          Dataset
        </button>
      </nav>

      {/* the menu on a phone */}
      {menuOpen && (
        <ul className="md:hidden bg-[#0f0f11] text-white space-y-3 p-4">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end className={getLinkStyle} onClick={() => setMenuOpen(false)}>
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            <button onClick={() => { setMenuOpen(false); setIsOpen(true); }} className="text-white hover:text-purple-500">
              Dataset
            </button>
          </li>
        </ul>
      )}

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Dataset in use"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-80 max-w-[90vw] shadow-xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="relative">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          <div className="pt-4 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <Database size={28} className="text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold break-words">{dataset.name}</h2>
              <p className="text-gray-600">{isSample ? 'Sample data' : 'Your uploaded posts'}</p>
            </div>

            <p className="text-sm text-gray-600 text-center">
              {isSample
                ? 'Every page shows the sample account. Upload a CSV of your own posts on the Analytics page.'
                : 'Every page shows the posts you uploaded. They are kept for 7 days and only this browser can open them.'}
            </p>

            <Link
              to="/analytics"
              onClick={() => setIsOpen(false)}
              className="block text-center bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded text-white"
            >
              {isSample ? 'Upload your own' : 'Manage on Analytics'}
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
