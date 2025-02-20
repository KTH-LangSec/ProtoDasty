const assign = require("deep-assign");
module.exports = function(x) {
  return entryPoint("__proto__", "x", x);
}

function entryPoint(arg1, arg2, arg3) {

  const obj = {};
  const pollution = arg3;
  obj[arg1][arg2][pollution] = arg3;

  const obj1 = {};
  const p = obj1[arg1];
  p[arg2] = arg3;

  return;
};

entryPoint("constructor", "prototype", "42");
