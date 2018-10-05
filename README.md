# CS241 Test Script :ok_hand:

![screenshot](https://github.com/dillionverma/cs241-test/blob/master/screenshot.png)

## Installation

```
git clone git@github.com:dillionverma/cs241-test.git
cd cs241-test && npm install
```

## Usage

`./test.js [compiler] [testFile]`

* `compiler` is the compiled version of c++/racket code
* `testFile` is a single YAML file which contains all test cases
 
    #### Example Usage
    ```
    make
    ./test.js ./asm test.yaml
    ```
    
    
## How to create tests

**[CLICK HERE](https://github.com/dillionverma/cs241-test/blob/master/test.yaml) to see an example `test.yaml` file**

Follow this exact template to create your own tests:

```
<testName>:
  in: |-
    <input here>
  out: |
    <output here>
  error: true || false       # default is false
```
