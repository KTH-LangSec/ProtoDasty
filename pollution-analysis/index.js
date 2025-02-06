// DO NOT INSTRUMENT

const fs = require('fs');
const PollutionAnalysis = require('./pollution-analysis');

const pkgName = J$.initParams.pkgName ?? 'result';
const resultListsPrefix = J$.initParams.resultListsPrefix ?? __dirname + '/../package-data/';
const driverDir = J$.initParams.driverDir ??  __dirname + '/../node-wrapper';

const resultPath = __dirname + '/results/';
const processResultPath = driverDir + '/exec-result.txt'; // writes a status for the node wrapper

const analysis = new PollutionAnalysis(pkgName, (err) => {
    let execStatus = 'success';
    console.log('Execution done');
});

J$.addAnalysis(analysis);