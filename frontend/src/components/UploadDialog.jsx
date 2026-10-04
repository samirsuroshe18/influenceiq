import { useRef, useState } from 'react';
import Modal from 'react-modal';
import { uploadDataset, SAMPLE_CSV_URL } from '../api/datasetApi';
import { errorMessage } from '../api/client';

const MAX_BYTES = 1024 * 1024;

// the same checks the server makes, so a wrong file is refused before it is sent
const problemWith = (file) => {
  if (!file) return 'Choose a CSV file to upload';
  if (!/\.csv$/i.test(file.name)) return 'Only .csv files are accepted';
  if (file.size > MAX_BYTES) return 'The file must be 1 MB or smaller';
  return '';
};

// Lets a visitor send a CSV of their own posts. onUploaded gets the new dataset and,
// when rows were skipped, the report of them.
const UploadDialog = ({ isOpen, onClose, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const input = useRef(null);

  // The browser reports a choice only when it differs from the last one, and it cannot
  // send a file that was changed on disk after it was chosen. So the box is emptied
  // whenever a choice is about to be made or a file was refused.
  const forget = () => {
    setFile(null);
    if (input.current) input.current.value = '';
  };

  const close = () => {
    if (sending) return;
    setFile(null);
    setError('');
    onClose();
  };

  const choose = (event) => {
    const chosen = event.target.files[0] || null;
    setFile(chosen);
    setError(chosen ? problemWith(chosen) : '');
  };

  const send = async (event) => {
    event.preventDefault();

    const problem = problemWith(file);
    if (problem) {
      setError(problem);
      return;
    }

    setSending(true);
    setError('');
    try {
      const res = await uploadDataset(file);
      setFile(null);
      onUploaded(res.data.dataset, res.data.skipped);
    } catch (failure) {
      setError(errorMessage(failure));
      forget();
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      contentLabel="Upload your posts"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[32rem] max-w-[92vw] max-h-[90vh] overflow-y-auto shadow-xl"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50"
    >
      <form onSubmit={send} noValidate>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Upload your posts</h2>
          <button type="button" onClick={close} aria-label="Close" className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          A CSV file with one row for each post. The first row names the columns:
        </p>
        <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-800 overflow-x-auto">post_type,date_posted,likes,shares,comments,views{'\n'}reels,2026-03-15,120,30,12,4000</pre>
        <ul className="mt-3 text-sm text-gray-600 list-disc pl-5 space-y-1">
          <li><span className="font-medium">post_type</span> is reels, carousel or static.</li>
          <li><span className="font-medium">date_posted</span> is written like 2026-03-15.</li>
          <li><span className="font-medium">views</span> and <span className="font-medium">post_id</span> are optional; other columns are ignored.</li>
          <li>Up to 2,000 rows and 1 MB.</li>
        </ul>
        <a href={SAMPLE_CSV_URL} download className="inline-block mt-3 text-sm text-purple-600 hover:underline">
          Download the sample as an example
        </a>

        <div className="mt-5">
          <label htmlFor="csv-file" className="block text-sm font-medium text-gray-800 mb-1">CSV file</label>
          <input id="csv-file" ref={input} type="file" accept=".csv,text/csv" onClick={forget} onChange={choose} className="block w-full text-sm text-gray-700" />
        </div>

        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

        <p className="mt-4 text-xs text-gray-500">
          Your posts are kept for 7 days and can be opened from this browser only. You can remove them at any time.
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={close} disabled={sending} className="px-4 py-2 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={sending || !file} className="bg-purple-600 hover:bg-purple-700 transition-colors px-4 py-2 rounded text-white disabled:opacity-50">
            {sending ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadDialog;
