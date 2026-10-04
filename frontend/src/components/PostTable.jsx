import { useMemo, useState } from 'react';
import { dayLabel, number, TYPE_LABELS } from '../lib/format';

const PER_PAGE = 10;

const COLUMNS = [
  { key: 'postId', label: 'Post ID', kind: 'text' },
  { key: 'datePosted', label: 'Date', kind: 'text' },
  { key: 'postType', label: 'Type', kind: 'text' },
  { key: 'likes', label: 'Likes', kind: 'number' },
  { key: 'views', label: 'Views', kind: 'number' },
  { key: 'shares', label: 'Shares', kind: 'number' },
  { key: 'comments', label: 'Comments', kind: 'number' },
];

// numbers are compared as numbers; ids as text, with "P2" before "P10"
const compare = (kind) => (a, b) =>
  kind === 'number' ? a - b : String(a).localeCompare(String(b), undefined, { numeric: true });

const PostTable = ({ posts }) => {
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ key: 'datePosted', direction: 'desc' });

  const sorted = useMemo(() => {
    const column = COLUMNS.find((one) => one.key === sort.key);
    const order = compare(column.kind);
    const sign = sort.direction === 'asc' ? 1 : -1;

    return [...posts].sort((a, b) => sign * order(a[sort.key], b[sort.key]));
  }, [posts, sort]);

  const pages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  // a shorter dataset can leave the page number beyond the end
  const current = Math.min(page, pages - 1);
  const shown = sorted.slice(current * PER_PAGE, (current + 1) * PER_PAGE);

  const sortBy = (key) => {
    setSort((previous) => ({ key, direction: previous.key === key && previous.direction === 'asc' ? 'desc' : 'asc' }));
    setPage(0);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-[#0f0f11] rounded-lg shadow-lg">
      <h2 className="text-2xl md:text-4xl font-bold text-center text-white mb-6">All Posts</h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-white text-sm md:text-base">
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.key} scope="col" className="px-3 md:px-4 py-2 border-b border-gray-700 text-left whitespace-nowrap" aria-sort={sort.key === column.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  <button type="button" onClick={() => sortBy(column.key)} className="font-semibold hover:text-purple-400">
                    {column.label} {sort.key === column.key && (sort.direction === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((post, index) => (
              <tr key={`${post.postId}-${index}`} className="hover:bg-[#151518]">
                <td className="px-3 md:px-4 py-2 border-b border-gray-800 break-all">{post.postId}</td>
                <td className="px-3 md:px-4 py-2 border-b border-gray-800 whitespace-nowrap">{dayLabel(post.datePosted)}</td>
                <td className="px-3 md:px-4 py-2 border-b border-gray-800">{TYPE_LABELS[post.postType]}</td>
                <td className="px-3 md:px-4 py-2 border-b border-gray-800">{number(post.likes)}</td>
                <td className="px-3 md:px-4 py-2 border-b border-gray-800">{number(post.views)}</td>
                <td className="px-3 md:px-4 py-2 border-b border-gray-800">{number(post.shares)}</td>
                <td className="px-3 md:px-4 py-2 border-b border-gray-800">{number(post.comments)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-lg disabled:opacity-40"
          onClick={() => setPage(current - 1)}
          disabled={current === 0}
        >
          Prev
        </button>
        <span className="text-white text-sm md:text-base">
          Page {current + 1} of {pages}
        </span>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-lg disabled:opacity-40"
          onClick={() => setPage(current + 1)}
          disabled={current >= pages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostTable;
