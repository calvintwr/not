
# Route Magic
[![npm version](https://img.shields.io/npm/v/you-are-not.svg?style=flat-square)](https://www.npmjs.com/package/you-are-not)
[![Build Status](https://badgen.net/travis/calvintwr/you-are-not?style=flat-square)](https://travis-ci.com/calvintwr/you-are-not)
[![Coverage Status](https://badgen.net/coveralls/c/github/calvintwr/you-are-not?style=flat-square)](https://coveralls.io/r/calvintwr/you-are-not)
[![license](https://img.shields.io/npm/l/you-are-not.svg?style=flat-square)](https://www.npmjs.com/package/you-are-not)
[![install size](https://badgen.net/packagephobia/install/you-are-not?style=flat-square)](https://packagephobia.now.sh/result?p=you-are-not)

>*Not* is a minimal, blazing fast, intuitive, and customisable type-checking helper. Meet project deadlines. Code with accuracy. No compiling required. *Not* checks at runtime, unlike Typescript.

*This module has no dependencies.*

## Simple Usage

### Double Negative Mechanism #not
*Not* uses a double negative mechanism (it is more powerful and will be explain further below). Simplest usage looks like this:
```js
const Not = require('you-are-not')
let not   = Not.create()
let str   = 'string'
not('number', str) // throws error
```
Will throw:
```
Wrong Type: Expecting `number` but got `string`.
```

## Why *Not*?

### Let's face it, we seldom type-check, because we're missing something.

*Not* is **that** small and convenient type-checking validation library you have been missing to do just that. It also overcomes JS quirks that gets in the way, like: `typeof null // 'object'`

### Typescript is not the full solution. With *Not*, You Don't Need Typescript
Typescript brings back compiling (*yucks!*), and doesn't check at runtime.

### Restore Javascript Flexibility
Unlock flexibility of Javascript, where typing need not be strict, and functions/APIs are made powerful by being able to accept argument different types.

### Meet Deadlines With Accurate Code
Write good code quickly; find the **balance** in code accuracy and writing speed. Leverage flexibility that Javascript has intended for.


## Installation

```
npm i --save you-are-not
```

## Double Negative Mechanism Explained
*Not* prefers a more powerful "double negative" mechanism, to definitively return `false` when the check passes. It follows the sensible human logic -- "Let's check if something is wrong (not what I want), so that I will do something. Nope, lets move on":
```js
if (not('string', 'i am string')) // do something
// Nope, let's move on.
```, 

When *Not* fails, it throws an error by default. Or, you can cleverly return a `string` **which can be used to evaluate to `true` to perform some operations!**
```js
const not = Not.create({ willThrowError: false })
// instead of throwing, `not` will return string

let input  = ['a', 'sentence']
let result = not('string', input) // returns a string, which can evaluate `true`

if (result) input = input.join(' ')
// so you can do your own error handling, or transformation

// code below can safely use `input` as string :)
input.toLowerCase()
```

## Full Usage

### Standard Example
```js
const Not = require('you-are-not')

function test(foo, bar) {
    let not = Not.create()

    // usage (accepts 4 arguments):
    not(

        'string',
        // type to expect
        //can be STRING or an ARRAY OF STRINGS

        foo,
        // the candidate being checked,

        'FOO',
        // (optional) name of the candidate
        // to prepare error message

        '[MESSAGE or TIMESTAMP]'
        // (optional) any additional notes
        // will be added to the message.
    )

    not(['undefined', 'number'], bar, 'bar')
    // this means `bar` can optional,
    // if not must be a number.
}

let fooNotString = ['foo']
test(fooNotString)
```
Will throw:
```
! Wrong Type (FOO): Expect type `string` but got `array`. [MESSAGE or TIMESTAMP].
```
#### The valid types you can check for are:
```js
'string'
'number'
'nan' // this is an opinion. NaN should not be of type number in the literal sense.
'array'
'object'
'function'
'boolean'
'null'
'undefined'
```
### *Not* Also Has `#is`
```js
let is = Not.createIs()
is('array', []) // returns true
is('number', NaN) // returns false
```
Because `#is` needs to return true when the check passes, it is not as powerful as `#not`.
### Example - Checking Multiple Types
Instead of the horrible:
```js
if (
    typeof foo !== 'string'
    || (typeof foo !== 'number'
    || (typeof foo === 'number' && !isNaN(chk)))
    || !Array.isArray(chk)
) {

    throw Error("Not valid, but I don't know why.")
}
```
You write:
```js
not(['string', 'number', 'array'], foo)
// or
is(['string', 'number', 'array'], foo)
```

### Need Heavy Lifting? Bulk Check (With Neat Coding)
#### Using `#lodge` And `#resolve`
In the real world, the our API params checking is a ~~leaning~~ tower of code. *Not* makes it neat and produces super user-friendly error messages. *No one loses hair*:
```js
const Not = require('you-are-not')
someAPIEndPoint((request, response) => {

	/* checking starts */
    let apiNot = Object.create(Not) // use the full object, don't call #create.

    apiNot.lodge('string', request.name, 'name')
    apiNot.lodge('boolean', request.subscribe, 'subscribe')
    apiNot.lodge(['string', 'array'], request.friends, 'friends')
    apiNot.lodge(['number', 'string'], request.age, 'age')
    // and many more lines

	try {
        apiNot.resolve() // this throws the error
    } catch (error) {
        response.status(500).send({ error })
        // errors are in error.trace
        return
    }
    /* checking ends */

    //nothing fails
    response.status(200).send('Success!')
})
```
`#resolve` can take a `callback` if you wish to handle the error yourself:
```js
apiNot.resolve(errors => {
    // custom handling
    throw errors
})
```
You can also switch off error throwing:
```js
apiNot.willThrowError = false
let list = apiNot.resolve()
// `list` will contain an array of error messages
```

## Options - *Not*'s Type-Checking Logic ("Opinions")
#### Native Javscript typing has a few quirks:
```js
typeof [] // object
typeof null // object
typeof NaN // number
```
Those are technically not wrong (or debatable), but often gets in the way.

#### By default, *Not* will apply the following treatment:
1. `NaN` is not a **'number'**, and will be **'nan'**.
2. `Array` and `[]` are of **'array'** type, and not **'object'**.
3. `null` is **'null'** and not an **'object'**.
4. Instance of `#String` is **'string'** and not an **'object'**.

### Switch Off *Not*'s Opinions
You can switch off opinionated type-checking:
```js
let not = Not.create({ isOpinionated: false })
```
When false, all Javascript the quirks will be restored, on top of *Not*'s opinions: An `Array` will both be an **'array'** as well as **'object'**, and `null` will both be **'null'** and **'object'**:
```js
not('object', []) // returns false -- `[]` is an object
not('array', []) // returns false -- `[]` is an array
not('object', null) // returns false -- `null` is an object
```
### Switch Off Opinions Partially
```js
// both #createIs and #create can take in the same options
let NotWithPartialOpinions = Not.createIs({
    opinionatedOnNaN:    false
    opinionatedOnArray:  false
    opinionatedOnNull:   false
    opinionatedOnString: false
})

// or mutate the object before instantiating.
let NotWithPartialOpinions = Object.create(Not)
Object.assign(NotWithPartialOptions, {
    opinionatedOnNaN:    false
    opinionatedOnArray:  false
    opinionatedOnNull:   false
    opinionatedOnString: false
})
let not = NotWithPartialOpinions.create()
let is  = NotWithPartialOpinions.createIs()
```

## More Advanced Usage
### Customise your message, by replacing the #msg method
You have to mutate the prototype:
```js
const CustomNot = require('you-are-not')

//overwrite the msg function with your own
CustomNot.msg = function(expect, got, name, note) {
    let msg = 'Hey there! We are sorry that something broke, please try again!'
    let hint = ` [Hint: (${name}) expect ${expect} got ${got} at ${note}.]`
    return global.isDeveloperMode ? msg += hint : msg
}
let customNot = CustomNot.create()
global.isDeveloperMode = true
customNot('string', [], 'someWrongInput', 'file.js - xxx function')
```
Will throw:
```
! Error: Hey there! We are sorry that something broke, please try again! [Hint: (someWrongInput) expect string got array at file.js - xx function. ]
```

## License

*Not* is MIT licensed.
