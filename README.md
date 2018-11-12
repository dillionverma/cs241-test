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

`cs241-test test [compiler] [testFile]`

* `compiler` is the compiled version of c++/racket code
* `testFile` is a single YAML file which contains all test cases
 
## Example Usage

```bash
make
cs241-test test ./asm test.yaml
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

---

# Example Usage

## Example [test.yaml](https://github.com/dillionverma/cs241-test/blob/master/test.yaml) file for A3/A4

`cs241-test test ./asm test.yaml -b`

```yaml
word-hex:
  in: |-
    .word 0x42
  out: |
    00000000: 00000000 00000000 00000000 01000010  ...B
jr-$31:
  in: |-
    jr $31
  out: |
    00000000: 00000011 11100000 00000000 00001000  ....
add-$0-$0-$0:
  in: |-
    add $0, $0, $0
  out: |
    00000000: 00000000 00000000 00000000 00100000  ... 
```

## Example [test.yaml](https://github.com/dillionverma/cs241-test/blob/master/test2.yaml) file for A6 onwards (any WLP4)

`cs241-test test ./wlp4scan test.yaml -w`

```yaml
test0:
  in: |-
    wain(int a, int b) {
      return a / b;
    }
  out: |
    WAIN wain
    LPAREN (
    INT int
    ID a
    COMMA ,
    INT int
    ID b
    RPAREN )
    LBRACE {
    RETURN return
    ID a
    SLASH /
    ID b
    SEMI ;
    RBRACE }
```
