import { Link } from "react-router-dom";
import Logo from "../assets/socialpulse.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <Link to="/">
            <img
              src={Logo}
              alt="Logo"
              className="h-24 w-80 mb-2"
            />
          </Link>
          <p className="text-gray-400 text-sm text-center md:text-left">
            Empowering innovation through AI-driven solutions.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <h4 className="text-lg font-semibold text-gray-100">Quick Links</h4>
          <Link to="/about" className="text-gray-300 hover:text-white">
            About Us
          </Link>
          <Link to="/contact" className="text-gray-300 hover:text-white">
            Contact
          </Link>
          <Link to="/privacy" className="text-gray-300 hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-gray-300 hover:text-white">
            Terms of Service
          </Link>
        </div>

        {/* Social Media and Contact */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h4 className="text-lg font-semibold text-gray-100">Follow Us</h4>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition duration-200"
            >
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition duration-200"
            >
              <i className="fab fa-twitter"></i>
            </Link>
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition duration-200"
            >
              <i className="fab fa-instagram"></i>
            </Link>
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition duration-200"
            >
              <i className="fab fa-linkedin-in"></i>
            </Link>
          </div>
          <p className="text-gray-400 text-sm">
            Email: <span className="text-gray-200">support@socialpulse.com</span>
          </p>
        </div>
      </div>

      {/* Divider and Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-6">
        <p className="text-center text-gray-500 text-sm">
          © 2025 SocialPulse All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
