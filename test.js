#!/usr/bin/env node
var fs = require('fs');
var colors = require('colors');
var exec = require('child_process').exec;
var yaml = require('js-yaml');

var testFile = './test.yaml'
var program;

if (process.argv[2]) {
  program = process.argv[2];
} else {
  console.log("Need program as argument")
  process.exit(1);
}

function printResults(equals, name) {
  if (equals) {
    console.log(`Pass: ${name}`.green)
  } else {
    console.log(`Fail: ${name}`.red)
  }
}

var tests = yaml.safeLoad(fs.readFileSync(testFile, {encoding: 'utf8'}));

var numComplete = 0;
var failCount = 0;
Object.entries(tests).forEach(([name, test]) => {
  numComplete++;
  let command = program + ' <<< "' + test.in + '" | xxd -b -c4';
  exec(command, (err, stdout, stderr) => {

    // VALID TEST CASE PASS - GOOD
    if (!stderr && !test.error) {
      printResults(stdout.toString() === test.out, name)

    // ERROR TEST CASE FAIL - GOOD
    } else if (stderr && test.error) {
      var expectedError = test.out || 'ERROR';
      printResults(stderr.toString().indexOf(expectedError) !== -1, name)

    // VALID TEST CASE FAIL - BAD
    } else if (stderr && !test.error){
      printResults(false, name)
      console.log(` Expected:\n  no error\n Actual:\n  ${stderr.toString()}`.yellow)
      failCount++;

    // ERROR TEST CASE PASS - BAD
    } else if (!stderr && test.error) {
      printResults(false, name)
      console.log(` Expected error, but got none`.yellow)
      failCount++;

    // MAGICAL ERRORS
    } else {
      console.log("err: " + stderr)
      console.log("stderr: " + stderr)
      console.log("stdout: " + stdout)
    }

  });
})

console.log(`Completed ${numComplete} tests`.blue)
