import React from "react";
import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PostTypePieChart from "../components/PostTypePieChart";
import PostTypeBarChart from "../components/PostTypeBarChart";
import PostTable from "../components/PostTable";
import axios from "axios";

const Analytics = () => {
  const [postData, setpostData] = useState({
    totalPosts: 0,
    statics: 0,
    reels: 0,
    carousel: 0,
    reelsData: {},
    staticData: {},
    carouselData: {},
    tableData: [],
  });
  const [loading, setLoading] = useState(true);
  const [hasApiCalled, setHasApiCalled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/users");
        const totalItems = response.data.length;

        // Reels data
        const reels = response.data.filter(
          (item) => item.query_text_values.post_type === "reels"
        );

        const totalReels = reels.length;

        const reelsData = reels.reduce(
          (acc, obj) => {
            const { likes, shares, comments } = obj.query_text_values;
            acc.totalLikes += parseInt(likes, 10);
            acc.totalShares += parseInt(shares, 10);
            acc.totalComments += parseInt(comments, 10);
            return acc;
          },
          { totalLikes: 0, totalShares: 0, totalComments: 0 }
        );

        // Static data
        const statics = response.data.filter(
          (item) => item.query_text_values.post_type === "static"
        );
        const totalStatic = statics.length;

        const staticData = statics.reduce(
          (acc, obj) => {
            const { likes, shares, comments } = obj.query_text_values;
            acc.totalLikes += parseInt(likes, 10);
            acc.totalShares += parseInt(shares, 10);
            acc.totalComments += parseInt(comments, 10);
            return acc;
          },
          { totalLikes: 0, totalShares: 0, totalComments: 0 }
        );

        // Carousel data
        const carousel = response.data.filter(
          (item) => item.query_text_values.post_type === "carousel"
        );

        const totalCarousel = carousel.length;

        const carouselData = carousel.reduce(
          (acc, obj) => {
            const { likes, shares, comments } = obj.query_text_values;
            acc.totalLikes += parseInt(likes, 10);
            acc.totalShares += parseInt(shares, 10);
            acc.totalComments += parseInt(comments, 10);
            return acc;
          },
          { totalLikes: 0, totalShares: 0, totalComments: 0 }
        );

        // Table data
        const tableData = response.data.map((obj) => ({
          post_id: obj.query_text_values.post_id,
          date_posted: obj.query_text_values.date_posted,
          post_type: obj.query_text_values.post_type,
          likes: obj.query_text_values.likes,
          views: obj.query_text_values.views,
          shares: obj.query_text_values.shares,
          comments: obj.query_text_values.comments,
        }));

        setpostData({
          totalPosts: totalItems,
          statics: totalStatic,
          reels: totalReels,
          carousel: totalCarousel,
          reelsData,
          staticData,
          carouselData,
          tableData,
        });

        setLoading(false);
        setHasApiCalled(true);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (!hasApiCalled) {
      fetchData();
    }
  }, [hasApiCalled]);

  const { numberTotalPosts } = useSpring({
    numberTotalPosts: postData.totalPosts,
    from: { numberTotalPosts: 0 },
    config: { duration: 1500 },
  });

  const { numberStatic } = useSpring({
    numberStatic: postData.statics,
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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 md:h-24 md:w-24 border-t-4 border-b-4 border-white"></div>
            <div className="text-white mt-4">Loading...</div>
          </div>
        </div>
      ) : (
        <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-6 md:mb-8">
            Analytics Overview
          </h1>

          {/* Post Type Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {/* Total Posts */}
            <div className="flex flex-col items-center justify-center p-4 md:p-6 bg-orange-500 rounded-lg shadow-lg">
              <animated.div className="text-6xl md:text-8xl font-semibold text-white">
                {numberTotalPosts.to((val) => Math.floor(val))}
              </animated.div>
              <div className="text-lg md:text-xl text-white mt-2">Total posts</div>
            </div>

            {/* Static Posts */}
            <div className="flex flex-col items-center justify-center p-4 md:p-6 bg-orange-500 rounded-lg shadow-lg">
              <animated.div className="text-5xl md:text-6xl font-semibold text-white">
                {numberStatic.to((val) => Math.floor(val))}
              </animated.div>
              <div className="text-lg md:text-xl text-white mt-2">Static</div>
            </div>

            {/* Reels Posts */}
            <div className="flex flex-col items-center justify-center p-4 md:p-6 bg-purple-500 rounded-lg shadow-lg">
              <animated.div className="text-5xl md:text-6xl font-semibold text-white">
                {numberReels.to((val) => Math.floor(val))}
              </animated.div>
              <div className="text-lg md:text-xl text-white mt-2">Reels</div>
            </div>

            {/* Carousel Posts */}
            <div className="flex flex-col items-center justify-center p-4 md:p-6 bg-blue-600 rounded-lg shadow-lg">
              <animated.div className="text-5xl md:text-6xl font-semibold text-white">
                {numberCarousel.to((val) => Math.floor(val))}
              </animated.div>
              <div className="text-lg md:text-xl text-white mt-2">Carousel</div>
            </div>
          </div>

          {/* Charts Section */}
          <section className="mt-8 md:mt-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 text-center">
              Post Type Distribution
            </h2>
            <div className="flex flex-col lg:flex-row justify-around items-center gap-8">
              <div className="w-full lg:w-1/2">
                <PostTypePieChart data={postData} />
              </div>
              <div className="w-full lg:w-1/2">
                <PostTypeBarChart data={postData} />
              </div>
            </div>
          </section>

          {/* Table Section */}
          <section className="mt-8 md:mt-12 overflow-x-auto">
            <PostTable data={postData} />
          </section>
        </main>
      )}
      <Footer />
    </div>
  );
};

export default Analytics;