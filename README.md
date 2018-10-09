# CS241 Test Script :ok_hand:


[![npm](https://img.shields.io/npm/v/cs241-test.svg)](https://www.npmjs.com/package/cs241-test)

<p align="center">
	<br>
	<img src="https://github.com/dillionverma/cs241-test/blob/master/screenshot.gif" width="700">
	<br>
</p>

## Installation

```bash
npm install -g cs241-test
```

## Usage

`cs241-test [compiler] [testFile]`

* `compiler` is the compiled version of c++/racket code
* `testFile` is a single YAML file which contains all test cases
 
## Example Usage

```bash
make
cs241-test ./asm test.yaml
```
    
    
## How to create tests

**[CLICK HERE](https://github.com/dillionverma/cs241-test/blob/master/test.yaml) to see an example `test.yaml` file**

Follow this exact template to create your own tests:

```yaml
<testName>:
  in: |-
    <input here>
  out: |
    <output here>
  error: true || false       # default is false
```
