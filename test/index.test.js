'use strict'

const Not = require('../index.js')
Not.willThrowError = false
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
})

describe('lodge', () => {
    const you = Object.create(Not)
    you.lodge('string', new String())
    you.lodge('array', {})

    //number
    it('should have _lodged array of length 1', () => {
        you._lodged.should.be.an('array')
        you._lodged.length.should.equal(1)
    })
})

describe('resolve', () => {

    const you = Object.create(Not)
    you.lodge('string', new String())
    it('should not resolve callback when all lodged cases pass', () => {
        you.resolve(errors => { return true }).should.be.false
    })

    const you2 = Object.create(Not)
    you2.lodge('string', new String())
    you2.lodge('array', {})
    it('should resolve callback when there are failed lodged cases', () => {
        let errors = you2.resolve(errors => { return errors })
        errors.trace.should.be.an('array')
        errors.trace.length.should.equal(1)
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
            'null',
            'undefined'
        ])
    })

})

describe('checkObject', () => {

    it('should return false when objects (no optionals) match', () => {
        Not.checkObject('noOptionals', {
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
        Not.checkObject('optionals', {
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

    it('should return error array when objects (with optionals) do not match', () => {
        let errors = Not.checkObject('optionalsNoMatch', {
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
        let errors = Not.checkObject('optionalsMatch', {
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

})
