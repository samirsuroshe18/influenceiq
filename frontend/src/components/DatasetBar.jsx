import { Download, Trash2, Upload, Undo2 } from 'lucide-react';
import { SAMPLE_CSV_URL } from '../api/datasetApi';
import { dateLabel, number } from '../lib/format';

const buttonClass = "inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50";

// Says which dataset is on screen and lets the visitor change it.
// info is the dataset as the server described it, once it has loaded.
const DatasetBar = ({ dataset, isSample, info, busy, onUpload, onBackToSample, onRemove }) => {
  return (
    <div className="bg-[#151518] border border-gray-800 rounded-lg p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-widest text-gray-400">{isSample ? 'Sample data' : 'Your upload'}</p>
        <h2 className="text-xl font-semibold text-white break-words">{dataset.name}</h2>
        {info && (
          <p className="text-sm text-gray-400">
            {number(info.postCount)} posts
            {info.expiresAt ? ` • kept until ${dateLabel(info.expiresAt)}` : ''}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={onUpload} disabled={busy} className={`${buttonClass} bg-purple-600 hover:bg-purple-700 text-white`}>
          <Upload size={16} /> {isSample ? 'Upload your CSV' : 'Upload another CSV'}
        </button>
        <a href={SAMPLE_CSV_URL} download className={`${buttonClass} border border-gray-600 text-white hover:bg-gray-800`}>
          <Download size={16} /> Download sample CSV
        </a>
        {!isSample && (
          <>
            <button onClick={onBackToSample} disabled={busy} className={`${buttonClass} border border-gray-600 text-white hover:bg-gray-800`}>
              <Undo2 size={16} /> Back to the sample
            </button>
            <button onClick={onRemove} disabled={busy} className={`${buttonClass} border border-red-500 text-red-400 hover:bg-red-500 hover:text-white`}>
              <Trash2 size={16} /> Remove my data
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DatasetBar;
