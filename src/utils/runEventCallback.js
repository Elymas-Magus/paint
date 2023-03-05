function runEventCallback(callback, { e, args = [] }) {
    if (typeof callback !== 'function') return;
    return callback.call(this, e, ...args);
}

export default runEventCallback;