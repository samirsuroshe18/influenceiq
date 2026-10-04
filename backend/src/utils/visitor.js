import net from 'net';

// The server sits behind the web app's proxy and the host's own. The first forwarded
// address is the visitor when the request came through the web app. Someone who calls
// the server directly can make that header up, so it is used only when it is an
// address at all, and limits that matter are also kept for the address the request
// really arrived from (req.ip).
const visitorOf = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    const first = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : '';

    return net.isIP(first) ? first : (req.ip || 'unknown');
};

export { visitorOf }
