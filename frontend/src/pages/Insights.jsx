import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useSpring, animated } from "react-spring";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Line, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

const Insights = () => {
  const [userInput, setUserInput] = useState(""); // For storing the user's input
  const [response, setResponse] = useState(null); // For storing the AI's response
  const [loading, setLoading] = useState(false); // To manage loading state

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const BASE_URL = import.meta.env.VITE_BASE_URL; // Fetch the base URL from .env
  const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;

  const payload = {
    input_value: userInput,
    input_type: "chat",
    output_type: "chat",
    tweaks: {
      "ChatInput-sb0kn": {},
      "Prompt-laWRx": {},
      "ParseData-EHGrZ": {},
      "AstraDBToolComponent-IHNnw": {},
      "GoogleGenerativeAIModel-socrv": {},
      "ChatOutput-95XP6": {},
      "JSONCleaner-if8NZ": {},
      "ParseData-uh6W9": {},
    },
  };

  const handleSubmit = async () => {
    setLoading(true); // Start loading

    try {
      const response = await axios({
        method: "post",
        url: "/api/lf/9bb3a128-8c2e-4416-866b-6ad45c278a17/api/v1/run/SocialPulse-Agent?stream=false",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
        data: payload,
      });

      // Parse the response string to JSON
      const jsonResponseString =
        response.data?.outputs[0]?.outputs[0]?.results?.message?.data?.text;

      console.log("Raw AI Response String:", jsonResponseString);

      // Remove backticks and ```json markers before parsing
      const cleanedJsonString = jsonResponseString.replace(/```json|```/g, "");

      console.log("Cleaned JSON String:", cleanedJsonString);

      const responseJson = JSON.parse(cleanedJsonString); // Parse cleaned JSON string

      // Use the parsed response to set the state
      const { insights, graph_creation, text_output } = responseJson;

      setResponse({
        insights,
        graph_creation,
        text_output,
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setLoading(false); // Clear the input field
    }
  };

  const bubbleAnimation = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(10px)" },
    config: { tension: 200, friction: 20 },
  });

  // Preparing the data for charts
  const graphData = response?.graph_creation;
  const chartData = {
    labels: ["Views", "Likes", "Shares", "Comments"],
    datasets: [
      {
        label: "Reels",
        data: graphData?.reels || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Static",
        data: graphData?.static || [],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "Carousel",
        data: graphData?.carousel || [],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  const lineChartData = {
    labels: ["Reels", "Static", "Carousel"],
    datasets: [
      {
        label: "Average Views",
        data: [
          graphData?.reels[0] || 0,
          graphData?.static[0] || 0,
          graphData?.carousel[0] || 0,
        ],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
      {
        label: "Average Likes",
        data: [
          graphData?.reels[1] || 0,
          graphData?.static[1] || 0,
          graphData?.carousel[1] || 0,
        ],
        fill: false,
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen  py-8 px-4">
        <div className="w-[85%] bg-[#151518] rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-3xl font-bold text-center text-white">
            Know Insights with <span className="text-purple-600">AI</span>
          </h2>

          {/* Chat Container */}

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-end">
                <div className="bg-purple-500 text-white p-4 rounded-lg max-w-xs">
                  <p>{userInput}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-start py-4">
              <animated.div
                style={bubbleAnimation}
                className="bg-gray-200 text-gray-800 p-4 rounded-lg max-w-lg"
              >
                {loading ? (
                  <div className="flex justify-center items-center ">
                    <svg width="60" height="20" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg" fill="#6b7280">
                      <circle cx="15" cy="25" r="5">
                        <animate attributeName="cy" values="25;15;25" dur="0.6s" repeatCount="indefinite" begin="0s" />
                      </circle>
                      <circle cx="50" cy="25" r="5">
                        <animate attributeName="cy" values="25;15;25" dur="0.6s" repeatCount="indefinite" begin="0.2s" />
                      </circle>
                      <circle cx="85" cy="25" r="5">
                        <animate attributeName="cy" values="25;15;25" dur="0.6s" repeatCount="indefinite" begin="0.4s" />
                      </circle>
                    </svg>
                  </div>
                ) : (
                  <div>
                    <p>{response?.text_output}</p>
                  </div>
                )}

              </animated.div>
            </div>


          </div>

          <div className="flex items-center gap-4">
            <textarea
              className="w-full p-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your question here..."
              value={userInput}
              onChange={handleInputChange}
              rows="1"
              disabled={loading} // Disable input while loading
            />
            <button
              onClick={handleSubmit}
              className={`bg-blue-500 text-white p-4 rounded-lg shadow-md transition ${loading ? "bg-white opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                }`}
              disabled={loading} // Disable button while loading
            >
              {loading ? <Loader/> : <FaPaperPlane size={24} />}
            </button>
          </div>

          {/* Graphs and Charts */}
          {response && (
            <div className="flex justify-center items-center gap-4 py-2 mb-4">
              <div className="w-full max-w-lg h-[80%] bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-center text-gray-800">
                  Engagement Metrics Comparison
                </h3>
                <Bar data={chartData} options={{ responsive: true }} />
              </div>
              <div className="w-full max-w-lg h-full bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-center text-gray-800">
                  Date-wise Engagement (Line Graph)
                </h3>
                <Line data={lineChartData} options={{ responsive: true }} />
              </div>
            </div>
          )}

          {/* User Input Box */}

        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Insights;
