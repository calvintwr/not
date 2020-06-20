'use strict'

const Not = require('../index.js')
// ES6
//import Not from '../index.js'
Not.willThrowError = false

// ES6 Shorthand
//import { NotWontThrow as Not } from '../index.js'

const should = require('chai').should()

describe('checking', () => {
    describe('checking - opinionated via #create', () => {
        const not = Not.create()
        //string x string
        it('should return false when comparing string', () => {
            not('string', '').should.be.false
        })

        //string x #String
        it('should return false when comparing #String with string', () => {
            not('string', new String('foo')).should.be.false
        })

        //number x 123
        it('should return false when comparing plain numbers', () => {
            not('number', 123).should.be.false
        })

        //number x 0
        it('should return false when comparing 0 as a number', () => {
            not('number', 0).should.be.false
        })

        //numer x Infinity
        it('should return false when comparing Infinity as a number', () => {
            not('number', -Infinity).should.be.false
        })

        //number x NaN
        it('should return failure message when comparing NaN as a number', () => {
            not('number', NaN, 'NaN test', 'This is an opinion that NaN should not be number')
                .should.equal('Wrong Type (NaN test): Expecting type `number` but got `nan`. Note: This is an opinion that NaN should not be number.')
        })

        // number x new #Number(NaN)
        it('should return failure message comparing #Number(NaN) as a number', () => {
            not('number', new Number(NaN)).should.equal('Wrong Type: Expecting type `number` but got `nan`.')
        })

        //array x []
        it('should return false when comparing array', () => {
            not('array', [1,2, function() {}]).should.be.false
        })

        //array x new Array()
        it('should return false when comparing instanceof #Array', () => {
            not('array', new Array()).should.be.false
        })

        //object x {}
        it('should return false when comparing object {}', () => {
            not('object', {}, 'someObject', 'A note').should.be.false
        })

        //object x []
        it('should return failure message when comparing [] as object', () => {
            not('object', [], 'array')
                .should.equal('Wrong Type (array): Expecting type `object` but got `array`.')
        })

        //object x null
        it('should return failure message when comparing null as object', () => {
            not('object', null)
                .should.equal('Wrong Type: Expecting type `object` but got `null`.')
        })

        //function x function
        it('should return false when comparing function', () => {
            not('function', function() {}).should.be.false
        })

        //boolean x true
        it('should return false when comparing `true` as `bolean`', () => {
            not('boolean', true).should.be.false
        })

        //boolean x true
        it('should return false when comparing `new #Boolean` as `bolean`', () => {
            not('boolean', new Boolean(false)).should.be.false
        })

        //bolean x null
        it('should return failure message when comparing `null` as `bolean`', () => {
            not('boolean', null).should.equal('Wrong Type: Expecting type `boolean` but got `null`.')
        })

        //bolean x undefined
        it('should return failure message when comparing `null` as `bolean`', () => {
            not('boolean', undefined).should.equal('Wrong Type: Expecting type `boolean` but got `undefined`.')
        })

        //null
        it('should return false when comparing null', () => {
            not('null', null).should.be.false
        })

        //null & object x null
        it('should return false when comparing null or object with null', () => {
            not(['null', 'object'], null).should.be.false
        })

        //Array & string x #String
        it('should return false when comparing array or string with #String', () => {
            not(['array', 'string'], new String()).should.be.false
        })

        //optional x undefined
        it('should return false when comparing optional with undefined', () => {
            not('optional').should.be.false
        })

        //optional and number x undefined
        it('should return false when comparing optional or number with null', () => {
            not(['optional', 'number'], null).should.be.false
        })

        //optional and number x undefined
        it('should return error message when comparing optional with function', () => {
            not('optional', function(){}).should.equal('Wrong Type: Expecting type `optional(null or undefined)` but got `function`.')
        })

        //optional and number x undefined
        it('should return false when comparing optional or number with number', () => {
            not(['optional', 'number'], 123).should.be.false
        })

        it('should throw error when passing expect as non-string', () => {
            (()=> {
                not([[], 'string'], new String())
            }).should.Throw(TypeError, 'Internal error: Say what you expect to check as a string. Found `array`.')
        })
    })

    describe('checking - not opinionated via #createNot', () => {
        let not2 = Object.create(Not)
        not2.isOpinionated = false
        let notOpinionated = not2.createNot()

        //string x string
        it('should return false when comparing string', () => {
            notOpinionated('string', '').should.be.false
        })

        //object x #String
        it('should return false when comparing #String to object', () => {
            not2.not('object', new String('foo')).should.be.false
        })

        //number x 123
        it('should return false when comparing plain numbers', () => {
            notOpinionated('number', 123).should.be.false
        })

        //number x NaN
        it('should return false comparing NaN as a number', () => {
            notOpinionated('number', NaN).should.be.false

        })

        //array x []
        it('should return failure message when comparing array', () => {
            notOpinionated('array', [1,2, function() {}]).should.be.false

        })

        //array x new Array()
        it('should return failure message when comparing instanceof #Array', () => {
            notOpinionated('array', new Array()).should.be.false
        })

        //object x {}
        it('should return false when comparing object {}', () => {
            notOpinionated('object', {}, 'someObject', 'A note').should.be.false
        })

        //object x []
        it('should return false when comparing [] as object', () => {
            notOpinionated('object', [], 'array').should.be.false

        })

        //object x null
        it('should return false when comparing null as object', () => {
            notOpinionated('object', null).should.be.false

        })

        //function x function
        it('should return false when comparing function', () => {
            notOpinionated('function', function() {}).should.be.false
        })

        //boolean x true
        it('should return false when comparing `true` as `bolean`', () => {
            notOpinionated('boolean', true).should.be.false
        })

        //null
        it('should return false when comparing null', () => {
            notOpinionated('null', null).should.be.false
        })

        //null & object x null
        it('should return false when comparing null or object with null', () => {
            notOpinionated(['null', 'object'], null).should.be.false
        })

        //Array & string x #String
        it('should return false when comparing array or string with #String', () => {
            notOpinionated(['array', 'string'], new String()).should.be.false
        })

        it('should throw error when passing expect as non-string', () => {
            (()=> {
                notOpinionated([[], 'string'], new String())
            }).should.Throw(TypeError, 'Internal error: Say what you expect to check as a string. Found `array` as `object`.')
        })
    })

    describe('checking - not opinionated on NaN', () => {
        const noonan = Not.create({
            opinionatedOnNaN: false
        })

        //string x #String
        it('should return false when comparing #String to string', () => {
            noonan('string', new String('foo')).should.be.false
        })

        //number x NaN
        it('should return false when comparing NaN as a number', () => {
            noonan('number', NaN).should.be.false
        })

        //object x []
        it('should still be opinionated and return failure message when comparing [] as object', () => {
            noonan('object', [], 'array').should.equal('Wrong Type (array): Expecting type `object` but got `array`.')
        })
    })

    describe('checking - not opinionated on array', () => {
        const nooa = Not.create({
            opinionatedOnArray: false
        })

        //string x #String
        it('should return false when comparing #String to string', () => {
            nooa('string', new String('foo')).should.be.false
        })

        //number x NaN
        it('should still be opinionated and return failure message when when comparing NaN as a number', () => {
            nooa(['number', 'object', 'string'], NaN).should.equal('Wrong Type: Expecting type `number`, `object` or `string` but got `nan`.')
        })

        //object x []
        it('should return false when comparing [] as object', () => {
            nooa('object', [], 'array').should.be.false
        })

        //array
        it('should return false when comparing [] as array', () => {
            nooa('array', []).should.be.false
        })
    })

    describe('checking - not opinionated on null', () => {
        const noon = Not.create({
            opinionatedOnNull: false
        })

        //string x #String
        it('should return false when comparing #String to string', () => {
            noon('string', new String('foo')).should.be.false
        })

        //number x NaN
        it('should still be opinionated and return failure message when when comparing NaN as a number', () => {
            noon(['number', 'object', 'string'], NaN).should.equal('Wrong Type: Expecting type `number`, `object` or `string` but got `nan`.')
        })

        //object x []
        it('should still be opinionated and return failure message when comparing [] as object', () => {
            noon('object', [], 'array').should.equal('Wrong Type (array): Expecting type `object` but got `array`.')
        })

        //null x null
        it('should return false when comparing null', () => {
            noon('null', null).should.be.false
        })

        //null x object
        it('should return false when comparing object with null', () => {
            noon('object', null).should.be.false
        })
    })

    describe('checking - not opinionated on string only', () => {
        const noos = Not.create({
            opinionatedOnString: false
        })

        //string x string
        it('should return false when comparing string', () => {
            noos('string', '').should.be.false
        })

        //object x #String
        it('should return false when comparing #String to object', () => {
            noos('object', new String('foo')).should.be.false
        })

        //string x #String
        it('should return false when comparing #String to string', () => {
            noos('string', new String('foo')).should.be.false
        })

        //number x NaN
        it('should still be opinionated and return failure message comparing NaN as a number', () => {
            noos('number', NaN).should.equal('Wrong Type: Expecting type `number` but got `nan`.')
        })

        //object x []
        it('should still be opinionated and return failure message when comparing [] as object', () => {
            noos('object', [], 'array').should.equal('Wrong Type (array): Expecting type `object` but got `array`.')
        })
    })

    describe('checking - not opinionated on number', () => {
        const noonumber = Not.create({
            opinionatedOnNumber: false
        })

        //number x number
        it('should return false when comparing number', () => {
            noonumber('number', 1).should.be.false
        })

        //object x new #Number
        it('should return false when comparing #Number to object', () => {
            noonumber('object', new Number('1')).should.be.false
        })

        //number x new #Number
        it('should return false when comparing #Number to number', () => {
            noonumber('number', new Number(1)).should.be.false
        })

        //number x new #Number(NaN)
        it('should still be opinionated and return failure message comparing #Number(NaN) as a number', () => {
            noonumber('number', new Number(NaN)).should.be.false
        })
    })

    describe('checking - not opinionated on boolean', () => {
        const noobool = Not.create({
            opinionatedOnBoolean: false
        })

        //bool x bool
        it('should return false when comparing bool', () => {
            noobool('boolean', true).should.be.false
        })

        //bool x new #Boolean
        it('should return false when comparing #Boolean to object', () => {
            noobool('object', new Boolean(true)).should.be.false
        })
    })

    describe('checking - willThrowError turned on', () => {
        const nwt = Not.create({
            willThrowError: true
        })

        //string x object
        it('should throw error when comparing string with object', () => {
            (()=> {
                nwt(['string'], {})
            }).should.Throw(TypeError, 'Wrong Type: Expecting type `string` but got `object`.')
        })
    })
})

describe('createIs', () => {
    const is = Not.createIs()

    //number
    it('should return true when comparing numbers', () => {
        is('number', 123).should.be.true
    })

    //number x NaN
    it('should return false when comparing number with NaN', () => {
        is('number', 123).should.be.true
    })

    //number/string x {}
    it('should return false when comparing string or number with object', () => {
        is(['number', 'string'], {}).should.be.false
    })

    //number/string x {}
    it('should not throw error and return false when comparing string or number with object', () => {
        let defaultNot = Object.create(Not)
        defaultNot.willThrowError = true
        let defaultIs = defaultNot.createIs()
        is(['number', 'string'], {}).should.be.false
    })
})

describe('lodge', () => {

    it('should throw error if attempting to use Not prototype directly', () => {
        (() => {
            Not.lodge('string', new String())
        }).should.Throw(Error, 'You cannot use #lodge on the Not prototype directly. Use Object.create(Not).')
    })

    it('should have _lodged array of length 1', () => {
        const you = Object.create(Not)
        you.lodge('string', new String())
        you.lodge('array', {})

        you._lodged.should.be.an('array')
        you._lodged.length.should.equal(1)
    })

    it('should return false when comparing matching case', () => {
        let you2 = Object.create(Not)
        you2.lodge('null', null).should.be.false
    })

})

describe('resolve', () => {

    const you = Object.create(Not)
    you.lodge('string', new String())
    it('should resolve callback with payload when all lodged cases pass (payload should be undefined. returns what callback returns)', () => {
        let returned = you.resolve((errors, payload) => { return [ errors, payload ] })
            returned.should.be.an('array')
            returned.length.should.equal(2)
            returned.should.include.members([
                false,
                undefined
            ])
    })

    const you2 = Object.create(Not)
    you2.lodge('string', new String())
    you2.lodge('array', {})
    it('should resolve callback when there are failed lodged cases', () => {
        let errors = you2.resolve(errors => { return errors })
        errors.should.be.an('array')
        errors.length.should.equal(1)
    })

    const you3 = Object.create(Not)
    you3.willThrowError = true
    you3.lodge('string', new String())
    you3.lodge('function', {})
    it('should throw errors when no callback provided', () => {
        (()=> {
            you3.resolve()
        }).should.Throw(TypeError, 'Wrong types provided. See `trace`.')
    })
})

describe('prepareExpect', () => {

    it('should map string "optional" in `expect` into "null" and "undefined"', () => {
        Not.prepareExpect([
            'undefined',
            'object',
            'optional'
        ]).should.be.an('array').that.include.members([
            'undefined',
            'object',
            '$$custom_optional'
        ])
    })

    it('should throw error when not given string or array', () => {
        (() => {
            Not.prepareExpect(1)
        }).should.Throw(TypeError, 'Internal error: Say what you expect to check as a string or array of strings. Found `number`.')
    })
})

describe('checkObject', () => {

    it('should return false when objects (no optionals) match', () => {
        let n = Object.create(Not)
        n.checkObject('noOptionals', {
            string: 'string',
            null: 'null',
            object: {
                object: {
                    number: 'number',
                    boolean: 'boolean'
                }
            }
        }, {
            string: 'string',
            null: null,
            object: {
                object: {
                    number: 123,
                    boolean: false
                }
            }
        }).should.be.false
    })

    it('should return false when objects (with optionals) match', () => {
        let n = Object.create(Not)
        n.checkObject('optionals', {
            string: 'string',
            null: 'null',
            object: {
                object: {
                    number: 'number',
                    boolean: 'boolean'
                }
            },
            optional__optional: { array: 'array' }
        }, {
            string: 'string',
            null: null,
            object: {
                object: {
                    number: 123,
                    boolean: false
                }
            },
            optional: { array: [] }
        }).should.be.false
    })

    it('should return false when objects (with optionals using "?") match', () => {
        let n = Object.create(Not)
        n.checkObject('optionals', {
            string: 'string',
            null: 'null',
            object: {
                object: {
                    number: 'number',
                    boolean: 'boolean'
                }
            },
            "optional?": { array: 'array' }
        }, {
            string: 'string',
            null: null,
            object: {
                object: {
                    number: 123,
                    boolean: false
                }
            },
            optional: { array: [] }
        }).should.be.false
    })

    it('should return false when objects (with optionals using "?") match', () => {
        let n = Object.create(Not)
        n.checkObject('optionals', {
            string: 'string',
            null: 'null',
            object: {
                object: {
                    number: 'number',
                    boolean: 'boolean',
                    "optional?": 'string'
                }
            },
            "optional?": { array: 'array' },
            "anOptionalThatIsMissing?": 'function'
        }, {
            string: 'string',
            null: null,
            object: {
                object: {
                    number: 123,
                    boolean: false
                }
            },
            optional: { array: [] }
        }).should.be.false
    })

    it('should return false when objects (overloaded with optionals using "__optional", "?" and "optional") match', () => {
        let n = Object.create(Not)
        n.checkObject('optionals', {
            "string__optional?": ['string', 'object', 'optional'],
            null: 'null'
        }, {
            null: null
        }).should.be.false
    })

    it('should return error array when objects (with optionals) do not match', () => {
        let n = Object.create(Not)
        let errors = n.checkObject('optionalsNoMatch', {
            string: 'string',
            null: 'null',
            object: {
                object: {
                    number: 'number',
                    boolean: 'boolean'
                }
            },
            compulsoryObject: {
                missing: 1
            },
            optional__optional: { array: 'array' }
        }, {
            string: [],
            null: false,
            object: {
                object: {
                    number: [],
                    boolean: function() {},
                    extraProperty: 'string'
                }
            },
            optional: { array: [] }
        })

        errors.should.be.an('array')
        errors.length.should.equal(5)
        errors.should.include.members([
            'Wrong Type (optionalsNoMatch.string): Expecting type `string` but got `array`.',
            'Wrong Type (optionalsNoMatch.null): Expecting type `null` but got `boolean`.',
            'Wrong Type (optionalsNoMatch.object.object.number): Expecting type `number` but got `array`.',
            'Wrong Type (optionalsNoMatch.object.object.boolean): Expecting type `boolean` but got `function`.',
            'Wrong Type (optionalsNoMatch.compulsoryObject): Expecting type `object` but got `undefined`.'
        ])
    })

    it('should return error array when optional object do not match', () => {
        let n = Object.create(Not)
        let errors = n.checkObject('optionalsMatch', {
            optional__optional: { array: 'array' }
        }, {
            optional: { array: null }
        })

        errors.should.be.an('array')
        errors.length.should.equal(1)
        errors.should.include.members([
            'Wrong Type (optionalsMatch.optional.array): Expecting type `array` but got `null`.',
        ])
    })

    it('should return error array when optional object do not match', () => {
        let n = Object.create(Not)
        let errors = n.checkObject('optionalsMatch', {
            optional__optional: { array: 'array' }
        }, {
            optional: { array: null }
        })

        errors.should.be.an('array')
        errors.length.should.equal(1)
        errors.should.include.members([
            'Wrong Type (optionalsMatch.optional.array): Expecting type `array` but got `null`.',
        ])
    })

    it('should return error (willThrowError = false) in callback', () => {
        let n = Object.create(Not)
        let errors = n.checkObject('optionalsMatch', {
            optional__optional: { array: 'array' }
        }, {
            optional: { array: null }
        }, function(errors, payload) {
            errors.should.be.an('array')
            errors.length.should.equal(1)
            errors.should.include.members([
                'Wrong Type (optionalsMatch.optional.array): Expecting type `array` but got `null`.',
            ])
            should.equal(payload, null)
        })
    })
    it('should return error (willThrowError = false) in callback (specified as options)', () => {
        let n = Object.create(Not)
        let schema = {
            optional__optional: { array: 'array' }
        }
        let candidate =  {
            optional: { array: null }
        }
        let callback = function(errors, payload) {
            errors.should.be.an('array')
            errors.length.should.equal(1)
            errors.should.include.members([
                'Wrong Type (optionalsMatch.optional.array): Expecting type `array` but got `null`.',
            ])
            should.equal(payload, null)
        }

        let errors = n.checkObject(
            'optionalsMatch',
            schema,
            candidate,
            {
                callback:  callback
            }
        )
    })

    it('should return error array when optional object do not match, even if returnPayload is true', () => {
        let n = Object.create(Not)
        let schema = {
            optional__optional: { array: 'array' }
        }

        let payload = {
            optional: { array: 123 }
        }

        let errors = n.checkObject(
            'optionalsMatch',
            schema,
            payload,
            { returnPayload: true }
        )

        errors.should.be.an('array')
        errors.length.should.equal(1)
        errors.should.include.members([
            'Wrong Type (optionalsMatch.optional.array): Expecting type `array` but got `number`.',
        ])
    })

    it('should return and sanitise payload (returnPayload = true) when objects match - deep nesting', () => {
        let n = Object.create(Not)
        let testFn = function() {}
        let schema = {
            optional__optional: { array: 'array'},
            object: { nested: 'function' }
        }

        let payload = {
            optional: { array: [] },
            object: { nested: testFn },
            toBeSanitised: 'test'
        }

        let sanitised = n.checkObject(
            'optionalsMatch',
            schema,
            payload,
            { returnPayload: true }
        )
        sanitised.should.be.an('object')
        sanitised.should.deep.equal({ optional: { array: [] }, object: { nested: testFn } })
    })

    it('should return and sanitise payload (returnPayload = true) and drop branches when there are no valid values', () => {
        let n = Object.create(Not)
        let schema = {
            optionalSanitise__optional: { array: ['array', 'optional'] }
        }

        let payload = {
            optionalSanitise: { noMatch: '1', noMatch2: 2 },
        }

        let sanitised = n.checkObject(
            'optionalsMatch',
            schema,
            payload,
            { returnPayload: true }
        )
        should.equal(sanitised, null)
    })

    it('should return false when there are no valid values', () => {
        let n = Object.create(Not)
        let schema = {
            optionalSanitise__optional: { array: ['array', 'optional'] },
            compulsorySanitise: { array: ['array', 'optional'] }
        }

        let payload = {
            optionalSanitise: { noMatch: '1', noMatch2: 2 },
            compulsorySanitise: { noMatch: {
                nested: {
                    foo: 'bar'
                }
            }}
        }

        n.checkObject(
            'optionalsMatch',
            schema,
            payload
        ).should.be.false
    })
})

describe('defineType', () => {

    it('should return false when number is more than one', () => {
        let not = Object.create(Not)

        not.defineType({
            primitive: 'number',
            type: 'numbermorethanone',
            pass: function(got) {
                return got > 1
            }
        })
        not.not('numbermorethanone', 10).should.be.false
    })

    it('should return false when is string or array of length 5', () => {
        let not = Object.create(Not)

        not.defineType({
            primitive: ['string', 'array'],
            type: 'length_five',
            pass: function(got) {
                return got.length === 5
            }
        })
        not.not(['length_five', 'string'], [1,2,3,4,5]).should.be.false
    })

    it('should return false when is string or array of length 5 using #pass', () => {
        let not = Object.create(Not)

        not.defineType({
            primitive: ['string', 'array'],
            type: 'length_five',
            pass: function(got) {
                return got.length === 5
            }
        })
        not.not(['length_five', 'string'], [1,2,3,4,5]).should.be.false
    })

    it('should return false when is string or array of length 5 using #pass, but checking for `function`', () => {
        let not = Object.create(Not)

        not.defineType({
            primitive: ['string', 'array'],
            type: 'length_five',
            pass: function(got) {
                return got.length === 5
            }
        })
        not.not(['length_five', 'function'], function() {}).should.be.false
    })

    it('should return error message (#not) or false (#is) for custom integer test of 4.4', () => {
        let not = Object.create(Not)

        not.defineType({
            primitive: 'number',
            type: 'integer',
            pass: function(candidate) {
                return candidate.toFixed(0) === candidate.toString()
            }
        })
        not.not('integer', 4.4).should.equal('Wrong Type: Expecting type `custom:integer` but got `number`.')
        not.is('integer', 4.4).should.be.false
    })

    it('should return error message (#not) or false (#is) falsey check', () => {
        let not = Object.create(Not)

        not.defineType({
            primitive: ['null', 'undefined', 'boolean', 'object', 'nan', 'array' ],
            type: 'falsey',
            pass: function(candidate) {
                if (not.is('object', candidate)) return Object.keys(candidate).length === 0
                if (not.is('array', candidate)) return candidate.length === 0
                if (not.is('boolean', candidate)) return candidate === false
                // its the other primitives null, undefined and nan
                // which is to be passed as falsey straight away without checking
                return true
            }
        })

        not.not('falsey', {}).should.be.false
        not.not('falsey', [null]).should.equal('Wrong Type: Expecting type `custom:falsey` but got `array`.')
        not.is('falsey', []).should.be.true
        not.is('falsey', undefined).should.be.true
        not.is(['falsey', 'function'], function() {}).should.be.true
    })


})

describe('_are', () => {
    it('should return true when matched', () => {
        Not._are('array', []).should.be.true
    })
    it('should return false when not matched', () => {
        Not._are('object', []).should.be.false
    })
})
