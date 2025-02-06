function entryPoint(arg1, arg2, arg3) {
  const obj = {};
  const p = obj[arg1];
  var p2 = p[arg2]
  p2 = arg3;
  return p;
}

entryPoint("__proto__", "x", 42);
