import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/socialpulse.png';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-6">
            <div className="container mx-auto flex sm:flex-row items-center justify-between space-y-6 sm:space-y-0 sm:space-x-8">
                {/* Logo Section */}
                <div className="text-xl font-bold">
                    <Link to="/" className="text-white hover:text-gray-400">
                        <img src={Logo} />
                    </Link>
                </div>

                {/* Links Section */}
                <div className='flex flex-col items-center space-y-4'>
                    <div className="flex items-center list-none gap-10 mr-16">
                        
                            <li>
                                <Link to="/about" className="text-white hover:text-gray-400">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-white hover:text-gray-400">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-white hover:text-gray-400">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-white hover:text-gray-400">
                                    Terms of Service
                                </Link>
                            </li>
                        
                    </div>

                    {/* Copyright Section */}
                    <div className="text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} SocialPulse. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
