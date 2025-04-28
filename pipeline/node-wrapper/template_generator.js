const exp = require('constants');
const fs = require('fs');
const path = require('path');

// Function to generate a fuzzing test for a specific package
function generateFuzzTarget(packageName, outputPath) {
  try {
    // Dynamically require the package to analyze
    const packagePath = `${__dirname}/../packages/${packageName}`;
    const packageModule = require(`${getMainFilePackage(packagePath)}`);
    // Generate the fuzzing code
    const fuzzCode = generateFuzzCode(packageName, packageModule);
    
    // Write the fuzzing code to a file
    fs.writeFileSync(path.join(outputPath, 'FuzzTarget.js'), fuzzCode);
    console.log(`Successfully generated FuzzTarget.js for ${packageName}`);
  } catch (error) {
    console.error(`Error generating fuzzing code for ${packageName}:`, error);
  }
}

function generateTaintTarget(packageName, outputPath) {
  try {
    // Dynamically require the package to analyze
    const packagePath = `${__dirname}/../packages/${packageName}`;
    const packageModule = require(`${getMainFilePackage(packagePath)}`);
    // Generate the fuzzing code
    const taintCode = generateTaintCode(packageName, packageModule);
    
    // Write the fuzzing code to a file
    fs.writeFileSync(path.join(outputPath, 'TaintTarget.js'), taintCode);
    console.log(`Successfully generated TaintTarget.js for ${packageName}`);
  } catch (error) {
    console.error(`Error generating tainting code for ${packageName}:`, error);
  }
}



































// ----------------------------------------------------------------- //
//                      Helper Function                              //
// ----------------------------------------------------------------- //



// Create the Parameter Name according to the function path name
function generateParamName(functionPath, i) {
  const newPath = functionPath.replace(/\./g, '_');
  
  return `${newPath}_param${i + 1}`;
}

// Obtaint the main file that needs to be imported
function getMainFilePackage(packagePath) {
  let _jsonPkgName = null;
  try {
      const data =  fs.readFileSync(`${packagePath}/package.json`, 'utf-8');
      const packageJson = JSON.parse(data);
      _jsonPkgName =  packageJson.main;
  } catch (err) {
      console.error('Error reading file:', `${packagePath}/package.json`, err);
  }

  return `${packagePath}/${_jsonPkgName}`;
}

// Helper function to determine the type of each export
function analyzeExports(packageModule) {
  const exports = {};
  
  if (typeof packageModule === 'function') {
    exports['__main__pkg'] = {
      type: 'function',
      paramCount: packageModule.length
    }
  } else if (typeof packageModule === 'object') {
    for (const key in packageModule) {
      const value = packageModule[key];
      const type = typeof value;

      if (type === 'function') {
        // For functions, we'll try to determine the expected parameters
        exports[key] = {
          type: 'function',
          paramCount: value.length // Number of expected arguments
        };
      } else if (type === 'object' && value !== null) {
        // For nested objects, recursively analyze them
        exports[key] = {
          type: 'object',
          properties: analyzeExports(value)
        };
      } else {
        // For primitive values
        exports[key] = {
          type: type,
          value: value
        };
      }
    }
  }
  
  return exports;
}

// Generate the arguments and function calls for fuzzing
function generateFuzzParamsCall(exportName, exportInfo) {
  let code = '';

  if (exportInfo.type === 'function') {
    let data_name = `data_${exportName.replace(/\./g, '_')}`;
    // Generate parameters based on the expected count
    code += `\n  try {\n`;
    code += `    const ${data_name} = new FuzzedDataProvider(fuzzerInputData);\n\n`;
    const params = [];
    for (let i = 0; i < exportInfo.paramCount; i++) {
      const paramName = generateParamName(exportName, i);
      
      code += `    const ${paramName} = ${data_name}.consumeString(16, "utf-8");\n`;
      params.push(paramName);
    }
    code += "\n\n";
    if (exportName === '__main__pkg') {
      // Original call with all parameters
      code += `    packageModule(${params.join(', ')});\n`;
      code += `    data_to_append.push({\n`;
      code += `      "function_name": "${exportName}",\n`;
      code += `      "args": [ ${params.join(', ')} ]\n`;
      code += `    });\n\n`;
      
      // Generate a call for each parameter replaced by {}
      for (let i = 0; i < params.length; i++) {
        const modifiedParams = params.map((param, index) => 
          index === i ? '{}' : param
      );
      code += `    packageModule(${modifiedParams.join(', ')});\n`;
      code += `    data_to_append.push({\n`;
      code += `      "function_name": "${exportName}",\n`;
      code += `      "args": [ ${modifiedParams.join(', ')} ]\n`;
      code += `    });\n\n`;
    }
    
    // TODO save the inputs to a seperate file
    } else {
      code += `    packageModule.${exportName}(${params.join(', ')});\n`;
      code += `    data_to_append.push({\n`;
      code += `      "function_name": "${exportName}",\n`;
      code += `      "args": [ ${params.join(', ')} ]\n`;
      code += `    });\n\n`;
      
      // Generate a call for each parameter replaced by {}
      for (let i = 0; i < params.length; i++) {
        const modifiedParams = params.map((param, index) => 
          index === i ? '{}' : param
        );

        code += `    packageModule.${exportName}(${modifiedParams.join(', ')});\n`;
        code += `    data_to_append.push({\n`;
        code += `      "function_name": "${exportName}",\n`;
        code += `      "args": [ ${modifiedParams.join(', ')} ]\n`;
        code += `    });\n\n`;
      }
    }
    
    code += `  } catch (e) {\n    // Catching exceptions to prevent crashes\n  }\n\n`;


  } else if (exportInfo.type === 'object') {
    // TODO handle multiple accesses
    // const analysis = generateFuzzParamsCall()
    for (const [_name, _value] of Object.entries(exportInfo.properties)) {
      let _new_name = `${exportName}.${_name}`
      code += generateFuzzParamsCall(_new_name, _value)
    }
  }

  return code;
}

function generateTaintFuncCall(exportName, exportInfo) {
  let code = '';

  if (exportInfo.type === 'function') {
    if (exportName === '__main__pkg') {
      code += `        case "__main__pkg":\n`;
      code += `          packageModule(...args);\n`;
      code += `          break;\n`;
    } else {
      code += `        case "${exportName}":\n`;
      code += `          packageModule.${exportName}(...args);\n`;
      code += `          break;\n`;
    }
  } else if (exportInfo.type === 'object') {
    // TODO handle multiple accesses
    // const analysis = generateFuzzParamsCall()
    for (const [_name, _value] of Object.entries(exportInfo.properties)) {
      let _new_name = `${exportName}.${_name}`
      code += generateTaintFuncCall(_new_name, _value)
    }
  }

  return code;
}



























// ----------------------------------------------------------------- //
//                       Main Code Functions                         //
// ----------------------------------------------------------------- //


// Generate fuzzing code based on the package's exports
function generateFuzzCode(packageName, packageModule) {
  const exports = analyzeExports(packageModule);
  
  // Start with the standard imports
  let packagePath = `${__dirname}/../packages/${packageName}`;
  const main_file = `${getMainFilePackage(packagePath)}`;

  let code = `const { FuzzedDataProvider } = require("@jazzer.js/core");\n`;
  code += `const packageModule = require("${main_file}");\n`;
  code += `const fs = require('fs')\n\n`;
  
  // Generate the fuzz function
  code += `// file "FuzzTarget.js"\n`;
  code += `module.exports.fuzz = function(fuzzerInputData) {\n`;
  code += `  let data_to_append = [];\n`;
  code += `  try {\n`;
  code += `    const rawData = fs.readFileSync(__dirname + "/fuzzing_results.json", 'utf-8');\n`;
  code += `    data_to_append = JSON.parse(rawData);\n`;
  code += `  } catch (error) {\n`;
  code += `    if (error.code !== 'ENOENT') throw error;\n`;
  code += `  }\n`
  
  // Add code to test each function export
  let hasFunctions = false;
  
  for (const [exportName, exportInfo] of Object.entries(exports)) {
    // TODO check recursively for functions with properties
    const result = generateFuzzParamsCall(exportName, exportInfo);
    if (result != '') {
      hasFunctions = true;
      code += result;
    }
  }
  // If no functions were found, add a generic test
  if (!hasFunctions) {
    code += `  console.log("No specific functions identified, testing with generic objects");\n`;
  }
  code += `  fs.writeFileSync(__dirname + "/fuzzing_results.json", JSON.stringify(data_to_append));\n`;

  code += `};\n`;
  
  return code;
}

function generateTaintCode(packageName, packageModule) {
  const exports = analyzeExports(packageModule);

  // Start with the standard imports
  let packagePath = `${__dirname}/../packages/${packageName}`;
  const main_file = `${getMainFilePackage(packagePath)}`;  

  let code = `const { FuzzedDataProvider } = require("@jazzer.js/core");\n`;
  code += `const packageModule = require("${main_file}");\n`;
  code += `const fs = require('fs')\n\n`;

  // Generate the fuzz function
  code += `process.on('unhandledRejection', function(reason, p){\n`;
  code += `  //call handler here\n`
  code += `});\n\n`

  code += `process.on('uncaughtException', function(error) {\n`;
  code += `  // call handler\n`;
  code += `});\n\n`;

  code += `// file "TaintTarget.js"\n`;
  code += `function main () {\n`;
  code += `  let fuzzed_results = [];\n`;
  code += `  try {\n`;
  code += `    const rawData = fs.readFileSync(__dirname + "/fuzzing_results.json", 'utf-8');\n`;
  code += `    fuzzed_results = JSON.parse(rawData);\n`;
  code += `  } catch (error) {\n`;
  code += `    if (error.code !== 'ENOENT') throw error;\n`;
  code += `  }\n\n`;

  code += `  for (const item of fuzzed_results) {\n`;
  code += `    let func_name = item.function_name;\n`;
  code += `    let args = item.args;\n\n`

  let hasFunctions = false;
  code += '    try {\n';
  code += `      switch (func_name) {\n`;
  console.log("|!!!!!!!!!!!!!!!!!!!!!!!!\n", exports);
  for (const [exportName, exportInfo] of Object.entries(exports)) {
    // TODO check recursively for functions with properties
    const result = generateTaintFuncCall(exportName, exportInfo)
    console.log("Generated Result for", exportName);
    if (result != '') {
      hasFunctions = true;
      code += result;
    }
  }

  code += `        default:\n`;
  code += `          console.log("Danger!!!!! Function not found!");\n`;
  code += `      }\n`;
  code += `    } catch (e) {\n      // pass errors\n    }\n\n`;

  // If no functions were found, add a generic test
  if (!hasFunctions) {
    code += `    console.log("No specific functions identified, testing with generic objects");\n`;
  }

  code += `  }\n`;
  code += `}\n\n`;

  code += `main();\n`;
  
  return code;
}

module.exports = {
  generateFuzzTarget,
  generateTaintTarget
}