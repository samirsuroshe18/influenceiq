import { useCallback, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DatasetBar from "../components/DatasetBar";
import UploadDialog from "../components/UploadDialog";
import PostTypePieChart from "../components/PostTypePieChart";
import PostTypeBarChart from "../components/PostTypeBarChart";
import MonthChart from "../components/MonthChart";
import TopPosts from "../components/TopPosts";
import PostTable from "../components/PostTable";
import { getAnalytics, removeDataset } from "../api/datasetApi";
import { errorMessage, statusOf } from "../api/client";
import { useDataset } from "../lib/DatasetContext";
import { number, rate, TYPE_LABELS } from "../lib/format";

const GONE = "Your uploaded posts are no longer stored, so the sample is shown instead.";

// a number that counts up to its value when it appears
const CountCard = ({ value, label, color }) => {
  const { shown } = useSpring({ shown: value, from: { shown: 0 }, config: { duration: 1200 } });

  return (
    <div className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-lg shadow-lg ${color}`}>
      <animated.div className="text-4xl md:text-5xl font-semibold text-white">
        {shown.to((current) => number(Math.floor(current)))}
      </animated.div>
      <div className="text-base md:text-lg text-white mt-2 text-center">{label}</div>
    </div>
  );
};

const Analytics = () => {
  const { dataset, isSample, notice, choose, reset, clearNotice } = useDataset();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [skipped, setSkipped] = useState(null);
  const [removing, setRemoving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setAnalytics(await getAnalytics(dataset.id));
    } catch (failure) {
      // an upload is deleted after a week; the browser may still remember it
      if (statusOf(failure) === 404 && dataset.id !== "sample") {
        reset(GONE);
        return;
      }
      setAnalytics(null);
      setError(errorMessage(failure));
    } finally {
      setLoading(false);
    }
  }, [dataset.id, reset]);

  useEffect(() => {
    load();
  }, [load]);

  const uploaded = (next, report) => {
    setUploadOpen(false);
    setSkipped(report.count > 0 ? report : null);
    choose(next);
  };

  const backToSample = () => {
    setSkipped(null);
    reset();
  };

  const remove = async () => {
    if (!window.confirm("Remove your uploaded posts from InfluenceIQ? This cannot be undone.")) return;

    setRemoving(true);
    try {
      await removeDataset(dataset.id);
      setSkipped(null);
      reset("Your uploaded posts were removed.");
    } catch (failure) {
      // already gone is the result the visitor wanted
      if (statusOf(failure) === 404) {
        reset("Your uploaded posts were removed.");
      } else {
        setError(errorMessage(failure));
      }
    } finally {
      setRemoving(false);
    }
  };

  // the figures on screen belong to the dataset in use, not to the one before it
  const ready = analytics && analytics.dataset.id === dataset.id;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-6 md:mb-8">
          Analytics Overview
        </h1>

        <DatasetBar
          dataset={dataset}
          isSample={isSample}
          info={ready ? analytics.dataset : null}
          busy={removing}
          onUpload={() => setUploadOpen(true)}
          onBackToSample={backToSample}
          onRemove={remove}
        />

        {notice && (
          <div role="status" className="mt-4 flex items-start justify-between gap-4 bg-[#151518] border border-purple-500 text-white rounded-lg p-4">
            <p>{notice}</p>
            <button onClick={clearNotice} aria-label="Dismiss" className="text-gray-400 hover:text-white">✕</button>
          </div>
        )}

        {skipped && (
          <div role="status" className="mt-4 bg-[#151518] border border-yellow-500 text-white rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold">
                {skipped.count} {skipped.count === 1 ? "row was" : "rows were"} skipped because {skipped.count === 1 ? "it" : "they"} could not be read.
              </p>
              <button onClick={() => setSkipped(null)} aria-label="Dismiss" className="text-gray-400 hover:text-white">✕</button>
            </div>
            <ul className="mt-2 text-sm text-gray-300 space-y-1">
              {skipped.rows.map((row) => (
                <li key={row.line}>Line {row.line}: {row.reason}</li>
              ))}
            </ul>
            {skipped.count > skipped.rows.length && (
              <p className="mt-2 text-sm text-gray-400">…and {skipped.count - skipped.rows.length} more.</p>
            )}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 md:h-24 md:w-24 border-t-4 border-b-4 border-white"></div>
              <div className="text-white mt-4">Loading…</div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="mt-8 text-center">
            <p className="text-red-400">{error}</p>
            <button onClick={load} className="mt-4 bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-2 rounded text-white">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && ready && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mt-8">
              <CountCard value={analytics.totals.posts} label="Total posts" color="bg-orange-500" />
              {analytics.byType.map((row) => (
                <CountCard
                  key={row.type}
                  value={row.posts}
                  label={TYPE_LABELS[row.type]}
                  color={{ reels: "bg-purple-600", carousel: "bg-green-600", static: "bg-blue-600" }[row.type]}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-4 md:mt-8">
              {[
                ["Views", number(analytics.totals.views)],
                ["Likes", number(analytics.totals.likes)],
                ["Shares", number(analytics.totals.shares)],
                ["Comments", number(analytics.totals.comments)],
                ["Engagement rate", rate(analytics.totals.engagementRate)],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#151518] border border-gray-800 rounded-lg p-4 text-center">
                  <p className="text-xl md:text-2xl font-semibold text-white break-words">{value}</p>
                  <p className="text-sm text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            <section className="mt-10 md:mt-12">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 text-center">
                Post Type Distribution
              </h2>
              <div className="flex flex-col lg:flex-row justify-evenly items-center gap-8">
                <PostTypePieChart byType={analytics.byType} />
                <PostTypeBarChart byType={analytics.byType} />
              </div>

              <div className="mt-8 overflow-x-auto bg-[#0f0f11] rounded-lg">
                <table className="w-full text-white text-sm md:text-base">
                  <thead>
                    <tr className="text-left text-gray-400">
                      <th scope="col" className="px-4 py-3">Type</th>
                      <th scope="col" className="px-4 py-3">Posts</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap">Avg. views</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap">Avg. likes</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap">Avg. shares</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap">Avg. comments</th>
                      <th scope="col" className="px-4 py-3 whitespace-nowrap">Engagement rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.byType.map((row) => (
                      <tr key={row.type} className="border-t border-gray-800">
                        <td className="px-4 py-3 font-semibold">{TYPE_LABELS[row.type]}</td>
                        <td className="px-4 py-3">{number(row.posts)}</td>
                        <td className="px-4 py-3">{number(row.averages.views)}</td>
                        <td className="px-4 py-3">{number(row.averages.likes)}</td>
                        <td className="px-4 py-3">{number(row.averages.shares)}</td>
                        <td className="px-4 py-3">{number(row.averages.comments)}</td>
                        <td className="px-4 py-3">{rate(row.engagementRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-500">Engagement rate: likes, shares and comments for every hundred views.</p>
            </section>

            <section className="mt-10 md:mt-12">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 text-center">Engagement by Month</h2>
              <MonthChart byMonth={analytics.byMonth} />
            </section>

            <section className="mt-10 md:mt-12">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 text-center">Top Posts</h2>
              <TopPosts posts={analytics.topPosts} />
            </section>

            <section className="mt-10 md:mt-12">
              <PostTable posts={analytics.posts} />
            </section>
          </>
        )}
      </main>

      <UploadDialog isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={uploaded} />
      <Footer />
    </div>
  );
};

export default Analytics;
