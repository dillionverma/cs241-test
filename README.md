# cs241-test

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

This is what a typical `test.js` file would look like:

```
test1:
  in: |-
    .word 4
  out: |
    00000000: 00000000 00000000 00000000 00000100  ....
test3:
  in: |-
    .word 0x42T
  error: true
```

Follow this exact template to create your own tests:

```
<testName>:
  in: |-
    <input here>
  out: |
    <output here>
  error: true || false       # default is false
```
