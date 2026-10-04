// The server sits behind the web app's proxy and the host's own. The first forwarded
// address is the visitor when the request came through the web app. Someone who calls
// the server directly can make that header up, so limits that matter are also kept
// for the address the request really arrived from (req.ip).
const visitorOf = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    const first = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '';

    return first || req.ip || 'unknown';
};

export { visitorOf }
