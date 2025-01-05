import React, { useEffect, useState } from 'react';

const Preloader = () => {
    const [showPreloader, setShowPreloader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPreloader(false);
        }, 3000); // Adjust the time as needed (3000ms = 3 seconds)

        return () => clearTimeout(timer);
    }, []);

    if (!showPreloader) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            {/* SVG Logo with Enhanced Pulse Animation */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 50"
                    fill="none"
                    className="absolute w-full h-full animate-pulse"
                >
                    <path
                        d="M10 25 L30 35 L50 15 L70 25 L90 20 L110 30 L130 25"
                        stroke="#4F46E5"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-lg opacity-50"></div>
            </div>

            {/* Loading Text with Better UX */}
            <p className="mt-8 text-lg font-semibold text-white tracking-wider uppercase animate-pulse">
                Preparing Awesomeness...
            </p>
        </div>
    );
};

export default Preloader;
