import { createContext, useContext } from 'react';

// { dataset: { id, name }, isSample, notice, choose(dataset), reset(notice?), clearNotice() }
export const DatasetContext = createContext(null);

export const useDataset = () => useContext(DatasetContext);
