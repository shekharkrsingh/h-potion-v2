// React Native Polyfills (MUST BE IMPORTED BEFORE EVERYTHING ELSE)
const TextEncodingPolyfill = require('text-encoding');

Object.assign(global, {
    TextEncoder: TextEncodingPolyfill.TextEncoder,
    TextDecoder: TextEncodingPolyfill.TextDecoder,
});
