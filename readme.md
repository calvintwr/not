![Not.Js - "All-in-one" type checking, validation, error handling and messaging.](https://user-images.githubusercontent.com/6825277/104813085-cec3f780-5841-11eb-8dda-6871497a876c.png)
[![npm version](https://img.shields.io/npm/v/you-are-not.svg?style=flat-square)](https://www.npmjs.com/package/you-are-not)
[![Build Status](https://badgen.net/travis/calvintwr/you-are-not?style=flat-square)](https://travis-ci.com/calvintwr/you-are-not)
[![Coverage Status](https://badgen.net/coveralls/c/github/calvintwr/you-are-not?style=flat-square)](https://coveralls.io/r/calvintwr/you-are-not)
[![license](https://img.shields.io/npm/l/you-are-not.svg?style=flat-square)](https://www.npmjs.com/package/you-are-not)
[![install size](https://badgen.net/packagephobia/install/you-are-not?style=flat-square)](https://packagephobia.now.sh/result?p=you-are-not)

>*Not* is a minimal, blazing fast, intuitive, API-centric, and customisable API payload sanitiser/type-checking/validation/error handing and messaging helper -- all in a small and neat pack.

```js
let schema    = { id: "number" } // endpoint only expects param "id"
let malicious = { id: 1, role: "admin" } //payload with malicious "role: admin"

let sanitised = Not.scrub(
    "objectName",
    schema
    payload
)
console.log(sanitised)
// outputs:
// { id: 1 }
```
`role: "admin"` is removed. Payload sanitised.

## Why *Not*?
*Not* gives **actionable** error messages, so you know exactly what has gone wrong with your inputs/arguments/API. Build friendly APIs. Meet project deadlines.

![Not.Js - "All-in-one" type checking, validation, error handling and messaging.](https://dev-to-uploads.s3.amazonaws.com/i/l74jrtmfy2p305fw9wvy.gif)

*This module has no dependencies.*

## Simple Usage

### 1. For API input type-checking, validation, sanitisation and error messaging:

```js
let schema = {
    id: 'number',
    name: 'string'
}

// payload may be a parsed body from API-requestors, or function arguments
let payloadWithTypeError = {
    id: "1", // this will error
    name: "foo"
}

var sanitised = Not.scrub(
    'payloadWithTypeError',
    schema,
    payloadWithTypeError
)

console.log(sanitised)
```
**console.log outputs actionable error messages:**
```
["Wrong Type (payloadWithTypeError.id): Expecting type `number` but got `string`: 1."]
```

To sanitise possible malicious payloads:
```js
let payloadWithMaliciousPayload = {
    id: 1,
    name: "foo",
    role: "admin" // simulating malicious payload. this will be sanitised
}

var sanitised = Not.scrub(
    'payloadWithMaliciousPayload',
    schema,
    payloadWithTypeError
)

console.log(sanitised)
```

**Outputs:**

```js
{
    id: 1,
    name: "foo"
}
```
`role: "admin"` is removed. Payload sanitised.

### 2. Lightweight ("simplified mode") type-checking

Besides being a payload sanitiser, *Not* is a type-checker under-the-hood.

Use *Not* to cuts down runtime type-checking verbiage.

Instead of:

```js
if (typeof foo !== 'string' ||
    typeof foo !== 'number' ||
    (typeof foo === 'number' && !isNaN(foo)) ||
    !Array.isArray(foo)
) {  throw Error("Not valid, but I don't know why.") }
```

You write:

```js
const Not = require('you-are-not')
const not = Not.create() // this exposes a simplified #not with no overloads
const is = Not.createIs()

not(['string', 'number', 'array'], foo)
// or
is(['string', 'number', 'array'], foo)
```

Testing some variables:

```js
let testString    = 'string'
let testNotString = 123

not('string', testString) // will return false
not('string', testNotString) // will throw error
not('integer', testNotString) // will return false
```
 *Not* uses a **double negative mechanism** (it is more powerful and will be explain further below).

## Installation

```
npm i --save you-are-not
```

## Double Negative Mechanism Explained
*Not* prefers a more powerful "double negative" mechanism, to definitively return `false` when the check passes.

It follows the sensible human logic -- "This is not what I want, let's stop and do something.":

```js
if (not('string', 'i am string')) // do something
// All good, let's move on.
```

When *Not* fails, **it throws an error by default**. Or, you can switch to return a `string` **which can be used to evaluate to `true` to perform some operations!**

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

### 1. Valid types

**The valid types you can check for are:**

```js
Primitives:
'string'
'number'
'array'
'object'
'function'
'boolean'
'null'
'undefined'
'symbol'
'nan' // this is an opinion. NaN should not be of type number in the literal sense.

Aggregated:
'optional' // which means 'null' and 'undefined'

Other custom types:
'integer'
```

### 2. #scrub/#checkObject
#checkObject is #scrub under the hood. Use #scrub for simplified usage (example above), and #checkObject when you want more control.

```js
Not.scrub(objectName, schema, payload
Not.checkObject(objectName, schema, payload, options)
```

`objectName`: (string) Name of object.

`schema`: (object) An object depicting your schema.

`payload`: (object) The payload to check for.

`callback/options`: (function or object | optional). To receive a sanitised payload, set options `returnPayload` to `true` (see examples below).

#### Defining Schema

The schema looks exactly like the payload you are expecting.

*Not* also has optional notation:
```js
// you can use optional notations like this:
"info?": {
    gender: 'string',
    "age?": 'number'
}
//is same as
info__optional: {
    gender: 'string',
    age__optional: 'number'
}
//is same as
info__optional: {
    gender: 'string',
    age: ['number', 'optional']
}
```

Check for multiple type by passing an array:

```js
info: {
    age: ['number', 'string'], // age can be of type number or string
    email: ['email'] // suppose you have created your own email validation checking. To create your own types, check examples below.
}
```

#### #checkObject advanced usage
1. If `callback/options` is a `callback` function, it will run the `callback`:

```js
checkObject(name, schema, payload, function(errors) {
    // do something with errors.
})
```

(Note: When callback is provided, Not assumes you want to handle things yourself, and will not throw errors regardless of the `willThrowError` flag.)

2. If `callback/options` is `{ returnPayload: true }`, `#checkObject` returns (a) the sanitised payload (object) when check passes, (b) or an array of errors if check fails:

```js
let sanitised = checkObject(
    name,
    schema,
    payload,
    { returnPayload: true }
)
if (Array.isArray(sanitised) {
    // do something with the errors
    return
}
// or continue using the sanitised payload.
DB.find(sanitised)
```

3. If `callback/options` is `{ callback: function() {}, returnPayload: true }`:

```js
let callback = function(errors, payload) {
    if(errors.length > 0) {
        // do something with the errors
        return
    }

    DB.find(payload)
}

checkObject(
    name,
    schema,
    payload,
    {
        returnPayload: true,
        callback: callback
    }
)
```

### 3. *Not* as simple type checker
You can also check for multiple types by passing an array. This is useful when you want your API to accept both string and number:
```js
let not = Not.create()
let id        = "123"
let anotherId = 123
let emailOptional = undefined

not(['string', 'number'], id)
not(['string', 'number'], anotherId)
not(['optional', 'string'], emailOptional) // if available, but be string.
// all will evaluate to false.
```

### 4. Methods Available

**The *Not* prototype has the following methods available:**
```js
Not.scrub(objectName, schema, payload)
Not.checkObject(objectName, schema, payload, options)

Not.not(expect, got, name, note)
Not.is(expect, got, name, note)

Not.lodge(expect, got, name, note)
Not.resolve([callback]) // this is used with #lodge.

Not.defineType(options)
```

### 5. Methods: `#not` and `#is`
```js
Not.not(expect, got, name, note)
Not.is(expect, got, name, note)
```
`expect`: (string or array of strings) The types to check for (see below on "3. Types to check for".

`got`: (any) This is the the subject/candidate/payload you are checking.

`name`: (string | optional) You can define a name of the subject/candidate/payload, which will be included into the error message.

`note`: (string | optional) Any additional notes you wish to add to the error message.

**Returns:**
1. If passed: `false`.
2. If failed: throws `TypeError` (default), `string`  (if `willNotThrow: false`) or `POJO/JSON` (if `messageInPOJO: true`).


### 6. Methods: `#defineType`: Define your own checks

#### Simple example
*Not* has a built-in custom type called `integer`, and suppose if you were to define it yourself, it will look like this:
```js
Not.defineType({
    primitive: 'number', // you must define your primitives
    type: 'integer', // name your test
    pass: function(candidate) {
        return candidate.toFixed(0) === candidate.toString()
        // or ES6:
        // return Number.isInteger(candidate)
    }
})

let schema = { age: 'integer' }

Not.scrub('name', schema, {
    age: 22.4 // this will fail
})
Not.not('integer', 4.4) // gives error message
Not.is('integer', 4.4) // returns false

```
#### Advanced example

Having trouble with empty `[]` or `{}` that sometimes is `false` or `null` or `undefined`?
Define a "falsey" type like this:

```js
let is = Not.createIs({ willThrowError: false })
Not.defineType({
    primitive: ['null', 'undefined', 'boolean', 'object', 'nan', 'array' ],
    type: 'falsey',
    pass: function(candidate) {
        if (is('object', candidate)) return Object.keys(candidate).length === 0
        if (is('array', candidate)) return candidate.length === 0
        if (is('boolean', candidate)) return candidate === false
        // its the other primitives null, undefined and nan
        // which is to be passed as falsey straight away without checking
        return true
    }
})

Not.not('falsey', {}) // returns false
Not.not('falsey', [null]) // returns error message
Not.is('falsey', []) // returns true
Not.is('falsey', undefined) // returns true
Not.is(['falsey', 'function'], function() {}) // returns true
```

### 7. Methods: `#lodge` and `#resolve`

You can also use `#lodge` And `#resolve` to bulk checking with more control:

```js
// create a descendant
let apiNot = Object.create(Not)

apiNot.lodge('string', request.name, 'name')
apiNot.lodge('boolean', request.subscribe, 'subscribe')
apiNot.lodge(['string', 'array'], request.friends, 'friends')
apiNot.lodge(['number', 'string'], request.age, 'age')
// and many more lines

apiNot.resolve()
/* OR */
apiNot.resolve(errors => {
    // optional callback, custom handling
    throw errors
})
```
(Note: This will not return any payload, since you intended to micro-manage.)


### 8. POJO Output
`messageInPOJO: true`
```js
let not = Not.create({
    messageInPOJO: true,
    willThrowError: false
})
not('array', { wrong: "stuff" }, 'payload', 'I screwed up.')
//outputs:
{
    message: 'Wrong Type (payload): Expect type `array` but got `object`: { wrong: "stuff" }. I screwed up.',
    expect: 'array',
    got: { wrong: "stuff" },
    gotType: 'object',
    name: 'payload',
    note: 'I screwed up.',
    timestamp: undefined
}
```


## Info: *Not*'s Type-Checking Logic ("Opinions")
**Native Javscript typing has a few quirks:**
```js
typeof [] // object
typeof null // object
typeof NaN // number
```
Those are technically not wrong (or debatable), but often gets in the way.

**By default, *Not* will apply the following treatment:**
1. `NaN` is not a **'number'**, and will be **'nan'**.
2. `Array` and `[]` are of **'array'** type, and not **'object'**.
3. `null` is **'null'** and not an **'object'**.
4. Instance of `new` `#String`, `#Number` or `#Boolean` are their not of type **'object'** but their respective types.

**Switch Off *Not*'s Opinions:**

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
**Switch Off Opinions Partially:**
```js
// both #createIs and #create can take in the same options
let NotWithPartialOpinions = Not.createIs({
    opinionatedOnNaN:     false,
    opinionatedOnArray:   false,
    opinionatedOnNull:    false,
    opinionatedOnString:  false,
    opinionatedOnNumber:  false,   
    opinionatedOnBoolean: false
})

// or mutate the object before instantiating.
let NotWithPartialOpinions = Object.create(Not)
Object.assign(NotWithPartialOptions, {
    opinionatedOnNaN:     false,
    opinionatedOnArray:   false,
    opinionatedOnNull:    false,
    opinionatedOnString:  false,
    opinionatedOnNumber:  false,   
    opinionatedOnBoolean: false
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
CustomNot.msg = function(expect, got, gotType, name, note) {
    let msg = 'Hey there! We are sorry that something broke, please try again!'
    let hint = ` [Hint: (${name}) expect ${expect} got ${gotType} at ${note}.]`

    // return different messages depending on environment
    return global.isDeveloperMode ? msg += hint : msg
}
```

```js
let customNot = CustomNot.create()
global.isDeveloperMode = true

let sanitised = customNot.scrub('someWrongInput', {
    someValue: 'string' // schema
}, {
    someValue: []
})

// or if using just the type checker:
customNot('string', [], 'someWrongInput', 'file.js - xxx function')
```
Will give error:
```
! Error: Hey there! We are sorry that something broke, please try again! [Hint: (someWrongInput) expect string got array at file.js - xx function. ]
```

## License

*Not* is MIT licensed.
