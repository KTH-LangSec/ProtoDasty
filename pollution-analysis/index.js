// DO NOT INSTRUMENT

const fs = require('fs');
const PollutionAnalysis = require('./pollution-analysis');

const pkgName = J$.initParams.pkgName ?? 'result';
const jsonPkgName = J$.initParams.jsonPkgName ?? 'result';
const resultFilename = J$.initParams.resultFilename ?? 'result';
const resultListsPrefix = J$.initParams.resultListsPrefix ?? __dirname + '/../package-data/';
const pkgDir = J$.initParams.pkgDir ?? 'result';
const driverDir = J$.initParams.driverDir ??  __dirname + '/../node-wrapper';

const resultPath = __dirname + '/results/';
const processResultPath = driverDir + '/exec-result.txt'; // writes a status for the node wrapper

const analysis = new PollutionAnalysis(pkgName, resultFilename, jsonPkgName, pkgDir, (err) => {
    let execStatus = 'success';
    console.log('Execution done');
});

J$.addAnalysis(analysis);