import { createContext, useContext } from 'react';

// {
//   dataset: { id, name }     the dataset every page shows
//   isSample                  whether that is the sample
//   upload: { id, name }|null the visitor's upload, also while the sample is shown
//   notice                    why the sample is shown, when the visitor did not ask for it
//   choose(upload)            a new upload: remember it and show it
//   viewSample(), viewUpload()
//   forgetUpload(notice?)     the upload was removed or no longer exists
//   clearNotice()
// }
export const DatasetContext = createContext(null);

export const useDataset = () => useContext(DatasetContext);
