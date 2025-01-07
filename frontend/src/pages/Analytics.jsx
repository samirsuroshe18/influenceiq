import React from 'react';
import { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import Navbar from '../components/Navbar';
import PostTypePieChart from '../components/PostTypePieChart';
import PostTypeBarChart from '../components/PostTypeBarChart'
import PostTable from '../components/PostTable';
import { collection, testConnection } from '../config/AstraDBConnection';

const Analytics = () => {
  const postData = {
    totalPosts: 150,
    static: 40,
    reels: 70,
    carousel: 40,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await collection.find({ /* your query */ });
        console.log(data);

        // Update `postData` with fetched data if necessary
        // Example: setPostData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const { numberTotalPosts } = useSpring({
    numberTotalPosts: postData.totalPosts,
    from: { numberTotalPosts: 0 },
    config: { duration: 1500 },
  });

  const { numberStatic } = useSpring({
    numberStatic: postData.static,
    from: { numberStatic: 0 },
    config: { duration: 1500 },
  });

  const { numberReels } = useSpring({
    numberReels: postData.reels,
    from: { numberReels: 0 },
    config: { duration: 1500 },
  });

  const { numberCarousel } = useSpring({
    numberCarousel: postData.carousel,
    from: { numberCarousel: 0 },
    config: { duration: 1500 },
  });

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center text-white mb-8 py-4 mt-4">Analytics Overview</h1>

        {/* Total Posts Card */}
        <div className="flex flex-col items-center justify-center p-6 w-72 m-4 mx-auto">
          <animated.div className="text-8xl font-semibold text-white">
            {numberTotalPosts.to((val) => Math.floor(val))}
          </animated.div>
          <div className="text-2xl text-white mt-2">Total Posts</div>
        </div>

        {/* Post Type Cards */}
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {/* Static Posts */}
          <div className="flex flex-col items-center justify-center p-6 bg-orange-500 rounded-lg shadow-lg w-72">
            <animated.div className="text-6xl font-semibold text-white">
              {numberStatic.to((val) => Math.floor(val))}
            </animated.div>
            <div className="text-xl text-white mt-2">Static</div>
          </div>

          {/* Reels Posts */}
          <div className="flex flex-col items-center justify-center p-6 bg-purple-800 rounded-lg shadow-lg w-72">
            <animated.div className="text-6xl font-semibold text-white">
              {numberReels.to((val) => Math.floor(val))}
            </animated.div>
            <div className="text-xl text-white mt-2">Reels</div>
          </div>

          {/* Carousel Posts */}
          <div className="flex flex-col items-center justify-center p-6 bg-blue-600 rounded-lg shadow-lg w-72">
            <animated.div className="text-6xl font-semibold text-white">
              {numberCarousel.to((val) => Math.floor(val))}
            </animated.div>
            <div className="text-xl text-white mt-2">Carousel</div>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="bg-gray-900 min-h-screen p-8 mt-8">
          <h1 className="text-4xl font-bold text-white mb-6 p-6 mt-6 " align="center">Post Type Distribution</h1>
          <button className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition">Kashasathi IDK</button>
          <div className="flex justify-between items-center">

            <PostTypePieChart/>
            <PostTypeBarChart/>
          </div>
        </div>
        <PostTable />
      </div>
    </>
  );
};

export default Analytics;
