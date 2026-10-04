import { dayLabel, number, TYPE_LABELS } from "../lib/format";

// the posts that drew the most likes, shares and comments together
const TopPosts = ({ posts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {posts.map((post, index) => (
        <div key={`${post.postId}-${index}`} className="bg-[#0f0f11] border border-gray-800 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between gap-2">
            <span className="text-2xl font-bold text-purple-400">#{index + 1}</span>
            <span className="px-2 py-0.5 rounded-full bg-gray-800 text-xs">{TYPE_LABELS[post.postType]}</span>
          </div>
          <p className="mt-2 font-semibold break-words">{post.postId}</p>
          <p className="text-sm text-gray-400">{dayLabel(post.datePosted)}</p>
          <p className="mt-3 text-2xl font-semibold">{number(post.engagement)}</p>
          <p className="text-xs text-gray-400">likes, shares and comments</p>
          <p className="mt-2 text-xs text-gray-400">
            {number(post.likes)} likes • {number(post.shares)} shares • {number(post.comments)} comments
          </p>
        </div>
      ))}
    </div>
  );
};

export default TopPosts;
