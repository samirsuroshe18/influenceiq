import { useCallback, useMemo, useState } from 'react';
import { DatasetContext } from '../lib/DatasetContext';
import { SAMPLE, forgetChat, readDataset, saveDataset } from '../lib/datasetStore';

// Holds which dataset every page shows: the sample, or the visitor's upload
const DatasetProvider = ({ children }) => {
  const [dataset, setDataset] = useState(readDataset);
  const [notice, setNotice] = useState('');

  const choose = useCallback((next) => {
    saveDataset(next);
    setDataset({ id: next.id, name: next.name });
    setNotice('');
  }, []);

  // back to the sample; the notice says why, when the visitor did not ask for it
  const reset = useCallback((reason = '') => {
    setDataset((current) => {
      if (current.id !== SAMPLE.id) forgetChat(current.id);
      return SAMPLE;
    });
    saveDataset(SAMPLE);
    setNotice(reason);
  }, []);

  const clearNotice = useCallback(() => setNotice(''), []);

  const value = useMemo(
    () => ({ dataset, isSample: dataset.id === SAMPLE.id, notice, choose, reset, clearNotice }),
    [dataset, notice, choose, reset, clearNotice]
  );

  return <DatasetContext.Provider value={value}>{children}</DatasetContext.Provider>;
};

export default DatasetProvider;
