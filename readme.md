# Route Magic
[![npm version](https://img.shields.io/npm/v/you-are-not.svg?style=flat-square)](https://www.npmjs.com/package/you-are-not)
[![Build Status](https://badgen.net/travis/calvintwr/you-are-not?style=flat-square)](https://travis-ci.com/calvintwr/you-are-not)
[![Coverage Status](https://badgen.net/coveralls/c/github/calvintwr/you-are-not?style=flat-square)](https://coveralls.io/r/calvintwr/you-are-not)
[![license](https://img.shields.io/npm/l/you-are-not.svg?style=flat-square)](https://www.npmjs.com/package/you-are-not)
[![install size](https://badgen.net/packagephobia/install/you-are-not?style=flat-square)](https://packagephobia.now.sh/result?p=you-are-not)

>Are you what I am looking for? A minimal, fast, intuitive, and customisable type-checking helper -- *Not*.

This module has no dependencies.

## Installation

```
npm i you-are-not
```

## Usage - This is meant to replace all your type checking libraries

```js
// this file is app.js
const Not = require('you-are-not')
const not = Not.create()

let str = 'foo'
let check = not('string', str)
console.log(check) // outputs false: means `str` is a 'string'
```
Why the double negative? Because passing is unimpressionable -- there's usually nothing you need to do. Whereas when the check fails, you need to handle it with some error message. This is where *Not* comes in to return a string which prepares the error message, and also evaluates to true. The message takes the form of:
```
Invalid Argument: Expect type `string` but got `object`.
```  
Example:
```js
let notString = []
let check = not('string', notString)
console.log(check) // outputs Invalid Argument: Expect type `string` but got `array`.

//First argument can also be an array if you want to check for multiple types.
let check = not(['string', 'array'], notString)
```
This can be very powerful, useful, and saves code for your API response:

### Simple Example
```js
someAPIEndPoint((request, respond) => {

    let chkName = not('string', request.name)
    // the below will evaluate to true
    if (chkName) throw new Error(chkName)

}).catch((error) => {
    respond.status = 500
    respond.send({ error: error.message })
})
```

### Real World API Tower of Params
```js
someAPIEndPoint((request, respond) => {

    let check = [
        not('string', request.name, 'name'),
        not(['number', 'string'], request.age, 'age'),
        not('boolean', request.subscribe, 'subscribe'),
        not(['string', 'array'], request.friends, 'friends'),
        ....
        ....
        .... this can go on for very long
    ]
    let failed = check.filter(value => { return value !== false })
    if (failed.length > 0) {
        let error = new Error('Invalid parameters provided. See `trace`.')
        error.trace = failed
        throw error
    }

}).catch((error) => {
    respond.status = 500
    respond.send({ error })
})
```
## More options
### Customise your message, provide some useful information
```js
let notString = {}
let timestamp = new Date().getTime()
let msg = not('string', notString, 'ParamName', `This is your API Key generated from... (error timestamp ${timestamp})`)
console.log(msg) // outputs: Invalid Argument (ParamName): Expect type `string` but got `object`. Note: This is your API Key generated from...(error timestamp XXX).

//Or overwrite the msg function with your own
not.msg = function(expect, got, name, note) {
    let msg = 'Hey there! We are sorry that something broke, please try again!'
    let hint = `(Hint: (${name}) ${expect)} ${got} ${note}.`
    return isDeveloperMode ? msg += hint : msg
}
```

### Opinions
```js
not.opinionated = true/false // true by default
```
By default true, *Not* will apply the following treatment:
1. NaN is not a 'number'.
2. Array is an 'array' and not an 'object'.
3. Null is 'null' and not an 'object'.
4. Instance of #String is 'string' and not an 'object'.

When false, all Javascript the quirks will be restored. So an Array will both be an 'array' as well as 'object':
```js
not.opinionated = false
console.log(not('object', [])) // outputs false -- [] is an object
console.log(not('array', [])) // outputs false -- [] is an array
```
You can also switch off certain "opinions":
```js
const NotWithPartialOpinions = require('you-are-not')
NotWithPartialOpinions.opinionatedOnNaN = false
NotWithPartialOpinions.opinionatedOnArray = false
NotWithPartialOpinions.opinionatedOnNull = false
NotWithPartialOpinions.opinionatedOnString = false
const not = NotWithPartialOpinions.create()
```
### License

*Not* is MIT licensed.
