import React, {useState} from 'react'
import { FaPaperPlane } from 'react-icons/fa';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Insights = () => {
  const [userInput, setUserInput] = useState(""); // For storing the user's input
  const [response, setResponse] = useState("");  // For storing the AI's response

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };



  // API Configuration
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;


  // Request payload
  const payload = {
    input_value: userInput,
    input_type: "chat",
    output_type: "chat",
    tweaks: {
      "ChatInput-sb0kn": {},
      "Agent-cihey": {},
      "ChatOutput-Zv759": {},
      "Prompt-laWRx": {},
      "ParseData-EHGrZ": {},
      "AstraDBToolComponent-IHNnw": {}
    }
  };

  // Function to make the API call
  const handleSubmit= async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${ BASE_URL } ? stream = false`,
        headers: {
        'Authorization': `Bearer ${ AUTH_TOKEN }`,
        'Content-Type': 'application/json'
      },
    data: payload
  });
  setResponse(response.data);
  console.log('Response:', response.data);
  
} catch (error) {
  console.error('Error:', error.response?.data || error.message);
  throw error;
}
}

const bubbleAnimation = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(10px)' },
    config: { tension: 200, friction: 20 },
  });

  return (
    <>
    <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 py-8 px-4">
    <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">Ask Your Question</h2>

      {/* Chat Container */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-start">
            <div className="bg-blue-500 text-white p-4 rounded-lg max-w-xs">
              <p>{userInput}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <animated.div style={bubbleAnimation} className="bg-gray-200 text-gray-800 p-4 rounded-lg max-w-xs">
              <p>{response}</p>
            </animated.div>
          </div>
        </div>
      </div>

      {/* User Input Box */}
      <div className="flex items-center gap-4">
        <textarea
          className="w-full p-4 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your question here..."
          value={userInput}
          onChange={handleInputChange}
          rows="3"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <FaPaperPlane size={20} />
        </button>
      </div>
    </div>
  </div>
  </>
);
};

export default Insights