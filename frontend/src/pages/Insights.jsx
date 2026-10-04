import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnswerChart from "../components/AnswerChart";
import { askQuestion } from "../api/datasetApi";
import { errorMessage, statusOf } from "../api/client";
import { useDataset } from "../lib/DatasetContext";
import { readChat, saveChat } from "../lib/datasetStore";

const QUESTION_MAX = 500;
const GONE = "Your uploaded posts are no longer stored, so the sample is shown instead.";

const SUGGESTIONS = [
  "Which post type performs best?",
  "How did engagement develop over the months?",
  "What do my top posts have in common?",
  "What should I post more of?",
];

const Typing = () => (
  <div className="flex justify-start">
    <div className="bg-gray-200 rounded-lg px-4 py-3" role="status" aria-label="The assistant is writing">
      <svg width="48" height="16" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg" fill="#6b7280" aria-hidden="true">
        {[15, 50, 85].map((cx, index) => (
          <circle key={cx} cx={cx} cy="25" r="6">
            <animate attributeName="cy" values="25;12;25" dur="0.6s" repeatCount="indefinite" begin={`${index * 0.2}s`} />
          </circle>
        ))}
      </svg>
    </div>
  </div>
);

const Message = ({ message }) => {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-purple-600 text-white px-4 py-3 rounded-lg max-w-[85%] md:max-w-xl whitespace-pre-wrap break-words">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg w-full max-w-[95%] md:max-w-2xl">
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        {message.insights?.length > 0 && (
          <ul className="mt-3 list-disc pl-5 space-y-1 text-sm">
            {message.insights.map((insight, index) => (
              <li key={index} className="break-words">{insight}</li>
            ))}
          </ul>
        )}
        {message.chart && <AnswerChart chart={message.chart} />}
      </div>
    </div>
  );
};

// the conversation about one dataset; a different dataset gets a conversation of its own
const Conversation = ({ dataset, onGone }) => {
  const [messages, setMessages] = useState(() => readChat(dataset.id));
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(null);
  // no more questions can be asked: today's are used up, or the server has no assistant
  const [closed, setClosed] = useState(false);
  const end = useRef(null);

  useEffect(() => {
    saveChat(dataset.id, messages);
  }, [dataset.id, messages]);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, sending]);

  const ask = async (text) => {
    const question = text.trim();
    if (!question || sending || closed) return;

    const before = messages;
    setMessages([...before, { role: "user", text: question }]);
    setInput("");
    setError("");
    setSending(true);

    try {
      const history = before.map(({ role, text: said }) => ({ role, text: said }));
      const { answer, remaining: left } = await askQuestion(dataset.id, question, history);

      setMessages((current) => [...current, { role: "assistant", ...answer }]);
      setRemaining(left);
    } catch (failure) {
      const status = statusOf(failure);

      if (status === 404) {
        onGone();
        return;
      }

      // the question got no answer: it goes back into the box to be sent again
      setMessages(before);
      setInput(question);
      setError(errorMessage(failure));
      setClosed(status === 429 || status === 503);
    } finally {
      setSending(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    ask(input);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      ask(input);
    }
  };

  const clear = () => {
    setMessages([]);
    setError("");
  };

  return (
    <div className="w-full max-w-4xl bg-[#151518] rounded-lg shadow-lg p-4 md:p-6 space-y-5">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Know Insights with <span className="text-purple-600">AI</span>
        </h1>
        <p className="mt-2 text-sm text-gray-400 break-words">
          Asking about <span className="text-white font-medium">{dataset.name}</span>.{" "}
          <Link to="/analytics" className="text-purple-400 hover:underline">See its analytics</Link>
        </p>
      </div>

      <div className="space-y-4 min-h-[12rem]" aria-live="polite">
        {messages.length === 0 && !sending && (
          <div className="text-center py-4">
            <p className="text-gray-400 mb-4">Ask anything about these posts. A few questions to start with:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => ask(suggestion)}
                  disabled={closed}
                  className="px-4 py-2 rounded-full border border-gray-600 text-sm text-white hover:bg-purple-600 hover:border-purple-600 transition-colors disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => <Message key={index} message={message} />)}
        {sending && <Typing />}
        <div ref={end} />
      </div>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

      <form onSubmit={submit} className="flex items-end gap-3">
        <label htmlFor="question" className="sr-only">Your question</label>
        <textarea
          id="question"
          className="w-full p-3 md:p-4 border rounded-lg shadow-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder={closed ? "No more questions can be asked right now" : "Type your question here..."}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
          maxLength={QUESTION_MAX}
          rows="2"
          disabled={sending || closed}
        />
        <button
          type="submit"
          aria-label="Send"
          className="bg-purple-600 text-white p-4 rounded-lg shadow-md transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={sending || closed || !input.trim()}
        >
          <FaPaperPlane size={20} />
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
        <span>
          {remaining === null ? "The answers come from the figures of this dataset." : `${remaining} ${remaining === 1 ? "question" : "questions"} left today.`}
        </span>
        {messages.length > 0 && (
          <button onClick={clear} disabled={sending} className="text-gray-400 hover:text-white disabled:opacity-50">
            Clear the conversation
          </button>
        )}
      </div>
    </div>
  );
};

const Insights = () => {
  const { dataset, notice, reset, clearNotice } = useDataset();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center py-6 md:py-8 px-4">
        {notice && (
          <div role="status" className="w-full max-w-4xl mb-4 flex items-start justify-between gap-4 bg-[#151518] border border-purple-500 text-white rounded-lg p-4">
            <p>{notice}</p>
            <button onClick={clearNotice} aria-label="Dismiss" className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}
        <Conversation key={dataset.id} dataset={dataset} onGone={() => reset(GONE)} />
      </main>
      <Footer />
    </div>
  );
};

export default Insights;
