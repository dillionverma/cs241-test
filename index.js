#!/usr/bin/env node
const fs        = require('fs');
const colors    = require('colors');
const exec      = require('child_process').exec;
const yaml      = require('js-yaml');
const ls        = require('log-symbols');
const async     = require('async');
const commander = require('commander');
const package   = require('./package.json');

commander
  .description(package.description)

commander
  .command('test <program> <testFile>')
  .description('your executable program and .yaml test file')
  .action((program, testFile) => {
    runTests(program, testFile);
  });

commander
  .option('-b, --binary', 'test mips machine code');

commander
  .option('-w, --wlp4', 'test wlp4 code');

commander
  .parse(process.argv);

function runTests(program, testFile = "test.yaml") {
  let tests = yaml.safeLoad(fs.readFileSync(testFile, {encoding: 'utf8'}));
  let results = {complete: 0, success: 0};
  let startTime = Date.now();
  async.eachOfSeries(tests, (test, name, done) => {
    let command = program
    if (commander.binary) {
      command += " | xxd -b -c4 "
    }
    results.complete++;
    var child = exec(command, (err, stdout, stderr) => {

      // VALID TEST CASE PASS - GOOD
      if (!stderr && !test.error) {
        let comp = stdout.toString() === test.out;
        printResults(comp, name)
        if (comp) {
          results.success++;
        } else {
          printErrors(test.out, stdout.toString())
        }

      // INVALID TEST CASE FAIL - GOOD
      } else if (stderr && test.error) {
        var expectedError = test.out || 'ERROR';
        let comp = stderr.toString().indexOf(expectedError) !== -1;
        printResults(comp, name)
        if (comp) {
          results.success++;
        } else {
          printErrors(test.out, stdout.toString())
        }

      // VALID TEST CASE FAIL - BAD
      } else if (stderr && !test.error){
        printResults(false, name)
        printErrors("no error", stderr.toString())

      // INVALID TEST CASE PASS - BAD
      } else if (!stderr && test.error) {
        printResults(false, name)
        console.log(ls.warning, `\nExpected error, but got none`.yellow)

      // MAGICAL ERRORS
      } else {
        console.log("err: " + stderr)
        console.log("stderr: " + stderr)
        console.log("stdout: " + stdout)
      }

      done();
    });
    child.stdin.end(test.in);
  }, e => {
    if (e) console.log("Script failed: ", e.message)
    console.log("\n============================\n".blue)
    console.log(`TEST SUMMARY\n`.bold.blue)

    // Colored output
    if (results.success === results.complete) {
      console.log(ls.success,` ${results.success}/${results.complete} tests passed`.green)
    } else if (results.success/results.complete < 0.5) {
      console.log(ls.error,` ${results.success}/${results.complete} tests passed`.red)
    } else {
      console.log(ls.warning,` ${results.success}/${results.complete} tests passed`.yellow)
    }
    console.log(`Time: ${((Date.now() - startTime) / 1000)}s\n`.green);
  });
}

function printErrors(expected, actual) {
  console.log(ls.warning, `\nExpected:\n${expected}`.yellow)
  console.log(`Actual:\n${actual}`.yellow)
}

function printResults(success, name) {
  if (success) {
    console.log(ls.success, ` ${name}`.green)
  } else {
    console.log(ls.error, ` ${name}`.red)
  }
}

