// Which dataset this browser is looking at. An upload is known only by its id, so the
// id is remembered here for as long as the upload exists, also while the visitor
// looks at the sample: forgetting it would leave the upload stored with no way back.
export const SAMPLE = { id: 'sample', name: 'Sample account' };

const UPLOAD_KEY = 'influenceiq.dataset';
const VIEW_KEY = 'influenceiq.viewSample';
const UPLOAD_ID = /^[0-9a-f]{32}$/;

// storage can be switched off or full; the app then simply shows the sample
const read = (storage, key) => {
  try {
    return window[storage].getItem(key);
  } catch {
    return null;
  }
};

const write = (storage, key, value) => {
  try {
    if (value === null) {
      window[storage].removeItem(key);
    } else {
      window[storage].setItem(key, value);
    }
  } catch {
    // the choice then lasts until the page is closed
  }
};

const parse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

// the visitor's upload, or null
export const readUpload = () => {
  const saved = parse(read('localStorage', UPLOAD_KEY));

  return saved && UPLOAD_ID.test(saved.id) && typeof saved.name === 'string'
    ? { id: saved.id, name: saved.name }
    : null;
};

export const saveUpload = (upload) =>
  write('localStorage', UPLOAD_KEY, upload ? JSON.stringify({ id: upload.id, name: upload.name }) : null);

// whether the visitor chose to look at the sample although they have an upload
export const readViewingSample = () => read('localStorage', VIEW_KEY) === 'yes';
export const saveViewingSample = (viewing) => write('localStorage', VIEW_KEY, viewing ? 'yes' : null);

// the conversation about a dataset, kept until the tab is closed
const chatKey = (id) => `influenceiq.chat.${id}`;

export const readChat = (id) => {
  const saved = parse(read('sessionStorage', chatKey(id)));
  const messages = Array.isArray(saved) ? saved : [];

  // a question whose answer never arrived (the page was left meanwhile) is not part
  // of the conversation
  return messages.length > 0 && messages[messages.length - 1].role === 'user' ? messages.slice(0, -1) : messages;
};

export const saveChat = (id, messages) => write('sessionStorage', chatKey(id), JSON.stringify(messages));

export const forgetChat = (id) => write('sessionStorage', chatKey(id), null);
