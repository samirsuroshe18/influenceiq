import { useCallback, useMemo, useState } from 'react';
import { DatasetContext } from '../lib/DatasetContext';
import { SAMPLE, forgetChat, readUpload, readViewingSample, saveUpload, saveViewingSample } from '../lib/datasetStore';

// Holds which dataset every page shows: the sample, or the visitor's upload
const DatasetProvider = ({ children }) => {
  const [upload, setUpload] = useState(readUpload);
  const [viewingSample, setViewingSample] = useState(readViewingSample);
  const [notice, setNotice] = useState('');

  const view = useCallback((sample) => {
    saveViewingSample(sample);
    setViewingSample(sample);
    setNotice('');
  }, []);

  const choose = useCallback((next) => {
    const chosen = { id: next.id, name: next.name };

    saveUpload(chosen);
    setUpload(chosen);
    view(false);
  }, [view]);

  const viewSample = useCallback(() => view(true), [view]);
  const viewUpload = useCallback(() => view(false), [view]);

  // the upload is gone from the server: nothing of it is kept here either
  const forgetUpload = useCallback((reason = '') => {
    const gone = readUpload();
    if (gone) forgetChat(gone.id);

    saveUpload(null);
    saveViewingSample(false);
    setUpload(null);
    setViewingSample(false);
    setNotice(reason);
  }, []);

  const clearNotice = useCallback(() => setNotice(''), []);

  const value = useMemo(() => {
    const dataset = upload && !viewingSample ? upload : SAMPLE;

    return { dataset, isSample: dataset.id === SAMPLE.id, upload, notice, choose, viewSample, viewUpload, forgetUpload, clearNotice };
  }, [upload, viewingSample, notice, choose, viewSample, viewUpload, forgetUpload, clearNotice]);

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
};

export default DatasetProvider;
