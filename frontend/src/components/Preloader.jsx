import React, { useEffect, useState } from 'react';
import loader from "../assets/cropped.svg";

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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="animate-spin">
                <img
                    src={loader}
                    alt="Loading..."
                    className="w-24 h-24 bg-transparent"
                />
            </div>
        </div>
    );
};

export default Preloader;
