//
 
  const utils = require("merge-change").utils;

   

  let obj = {};
  utils.set.__x_toTaint = true;
  utils.set(obj, ["__proto__", "polluted"], "yes");
// End of file
