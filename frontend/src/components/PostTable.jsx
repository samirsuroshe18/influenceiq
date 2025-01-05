import React, { useState } from 'react';

const sampleData = Array.from({ length: 100 }, (_, index) => ({
  post_id: `post-${index + 1}`,
  datetime: new Date(2023, 11, 1 + index).toLocaleString(),
  post_type: ['reel', 'carousel', 'static'][index % 3],
  likes: Math.floor(Math.random() * 500),
  views: Math.floor(Math.random() * 1000),
  shares: Math.floor(Math.random() * 100),
  comments: Math.floor(Math.random() * 200),
}));

const PostTable = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'post_id', direction: 'asc' });
  const postsPerPage = 10;
  const totalPages = Math.ceil(sampleData.length / postsPerPage);

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Function to sort data based on the current sort configuration
  const sortedData = [...sampleData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Slice data for the current page
  const currentData = sortedData.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage);

  const handleArrowKey = (e) => {
    if (e.key === 'ArrowRight') {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    }
    if (e.key === 'ArrowLeft') {
      setCurrentPage((prev) => Math.max(prev - 1, 0));
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleArrowKey);
    return () => window.removeEventListener('keydown', handleArrowKey);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center text-white mb-8">Post Analytics</h1>

      <table className="min-w-full table-auto bg-gray-900 text-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => handleSort('post_id')}>
              Post ID {sortConfig.key === 'post_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => handleSort('datetime')}>
              Datetime {sortConfig.key === 'datetime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => handleSort('post_type')}>
              Post Type {sortConfig.key === 'post_type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => handleSort('likes')}>
              Likes {sortConfig.key === 'likes' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => handleSort('views')}>
              Views {sortConfig.key === 'views' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => handleSort('shares')}>
              Shares {sortConfig.key === 'shares' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-2 border-b cursor-pointer" onClick={() => handleSort('comments')}>
              Comments {sortConfig.key === 'comments' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((post) => (
            <tr key={post.post_id}>
              <td className="px-4 py-2 border-b">{post.post_id}</td>
              <td className="px-4 py-2 border-b">{post.datetime}</td>
              <td className="px-4 py-2 border-b">{post.post_type}</td>
              <td className="px-4 py-2 border-b">{post.likes}</td>
              <td className="px-4 py-2 border-b">{post.views}</td>
              <td className="px-4 py-2 border-b">{post.shares}</td>
              <td className="px-4 py-2 border-b">{post.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-6">
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        >
          Prev
        </button>
        <span className="text-white">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostTable;
