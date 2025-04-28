const packageModule = require("/home/mateus/Dasty/pipeline/node-wrapper/../packages/ping/index.js");
const fs = require('fs')

process.on('unhandledRejection', function(reason, p){
  //call handler here
});

process.on('uncaughtException', function(error) {
  // call handler
});

// file "FuzzTarget.js"
function main () {
  let fuzzed_results = [];
  try {
    const rawData = fs.readFileSync(__dirname + "/fuzzing_results.json", 'utf-8');
    fuzzed_results = JSON.parse(rawData);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  for (const item of fuzzed_results) {
    let func_name = item.function_name;
    let args = item.args;
    
    try {
      switch (func_name) {
        case "promise.probe":
          packageModule.promise.probe(...args);
          break;
        case "sys.probe":
          packageModule.sys.probe(...args);
          break;
        default:
          console.log(`DANGER!!!!! Function ${func_name} not found!`);
      }
    } catch (e) {
      // pass errors
    }
            
  }
};

main();
