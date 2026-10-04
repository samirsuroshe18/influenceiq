// Which dataset this browser is looking at. An upload is known only by its id, so the
// id is kept here; without it the visitor sees the sample.
export const SAMPLE = { id: 'sample', name: 'Sample account' };

const KEY = 'influenceiq.dataset';
const UPLOAD_ID = /^[0-9a-f]{32}$/;

// storage can be switched off or full; the app then simply shows the sample
export const readDataset = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY));
    if (saved && UPLOAD_ID.test(saved.id) && typeof saved.name === 'string') {
      return { id: saved.id, name: saved.name };
    }
  } catch {
    // nothing usable was saved
  }

  return SAMPLE;
};

export const saveDataset = (dataset) => {
  try {
    if (dataset.id === SAMPLE.id) {
      window.localStorage.removeItem(KEY);
    } else {
      window.localStorage.setItem(KEY, JSON.stringify({ id: dataset.id, name: dataset.name }));
    }
  } catch {
    // the choice then lasts until the page is closed
  }
};

// the conversation about a dataset, kept until the tab is closed
const chatKey = (id) => `influenceiq.chat.${id}`;

export const readChat = (id) => {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(chatKey(id)));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

export const saveChat = (id, messages) => {
  try {
    window.sessionStorage.setItem(chatKey(id), JSON.stringify(messages));
  } catch {
    // the conversation then lasts until the page is left
  }
};

export const forgetChat = (id) => {
  try {
    window.sessionStorage.removeItem(chatKey(id));
  } catch {
    // nothing to forget
  }
};
