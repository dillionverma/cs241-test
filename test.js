#!/usr/bin/env node
const fs = require('fs');
const colors = require('colors');
const exec = require('child_process').exec;
const yaml = require('js-yaml');
const ls = require('log-symbols');
const async = require('async');

let testFile = 'test.yaml'
let program;

if (process.argv[2] && process.argv[3]) {
  program = process.argv[2];
  testFile = process.argv[3];
} else if (process.argv[2]) {
  program = process.argv[2];
} else {
  console.log("Need program as argument")
  process.exit(1);
}

function printResults(equals, name) {
  if (equals) {
    console.log(ls.success, ` ${name}`.green)
  } else {
    console.log(ls.error, ` ${name}`.red)
  }
}

let tests = yaml.safeLoad(fs.readFileSync(testFile, {encoding: 'utf8'}));
let results = {complete: 0, success: 0};
let startTime = Date.now();

async.eachOfSeries(tests, (test, name, done) => {
  let command = program + ' <<< "' + test.in + '" | xxd -b -c4';
  results.complete++;
  exec(command, (err, stdout, stderr) => {

    // VALID TEST CASE PASS - GOOD
    if (!stderr && !test.error) {
      let comp = stdout.toString() === test.out;
      printResults(comp, name)
      if (comp) {
        results.success++;
      } else {
        console.log(ls.warning, ` Expected:\n     ${test.out}`.yellow)
        console.log(`   Actual:\n     ${stdout.toString()}`.yellow)
      }

    // INVALID TEST CASE FAIL - GOOD
    } else if (stderr && test.error) {
      var expectedError = test.out || 'ERROR';
      let comp = stderr.toString().indexOf(expectedError) !== -1;
      printResults(comp, name)
      if (comp) {
        results.success++;
      } else {
        // If expecting a specific error message
        console.log(ls.warning, ` Expected:\n     ${test.out}`.yellow)
        console.log(`   Actual:\n     ${stderr.toString()}`.yellow)
      }

    // VALID TEST CASE FAIL - BAD
    } else if (stderr && !test.error){
      printResults(false, name)
      console.log(ls.warning, ` Expected:\n     no error\n   Actual:\n     ${stderr.toString()}`.yellow)

    // INVALID TEST CASE PASS - BAD
    } else if (!stderr && test.error) {
      printResults(false, name)
      console.log(ls.warning, ` Expected error, but got none`.yellow)

    // MAGICAL ERRORS
    } else {
      console.log("err: " + stderr)
      console.log("stderr: " + stderr)
      console.log("stdout: " + stdout)
    }

    done();
  });
}, e => {
  if (e) console.log("Script failed: ", e.message)
  console.log("\n============================\n".blue)
  console.log(`TEST SUMMARY\n`.bold.blue)

  if (results.success === results.complete) {
    console.log(ls.success,` ${results.success}/${results.complete} tests passed`.green)
  } else if (results.success/results.complete < 0.5) {
    console.log(ls.error,` ${results.success}/${results.complete} tests passed`.red)
  } else {
    console.log(ls.warning,` ${results.success}/${results.complete} tests passed`.yellow)
  }
  console.log(`Time: ${((Date.now() - startTime) / 1000)}s\n`.green);
});


