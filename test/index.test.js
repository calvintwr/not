'use strict'


const Not = require('../index.js')
const should = require('chai').should()

describe('checking - opinionated', () => {
    const not = Object.create(Not).create()
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
            .should.equal('Invalid Argument (NaN test): Expect type `number` but got `nan`. Note: This is an opinion that NaN should not be number.')
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
            .should.equal('Invalid Argument (array): Expect type `object` but got `array`.')
    })

    //object x null
    it('should return failure message when comparing null as object', () => {
        not('object', null)
            .should.equal('Invalid Argument: Expect type `object` but got `null`.')
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
        not('boolean', null).should.equal('Invalid Argument: Expect type `boolean` but got `null`.')
    })

    //bolean x undefined
    it('should return failure message when comparing `null` as `bolean`', () => {
        not('boolean', undefined).should.equal('Invalid Argument: Expect type `boolean` but got `undefined`.')
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

    it('should throw error when passing expect as non-string', () => {
        (()=> {
            not([[], 'string'], new String())
        }).should.Throw(Error, 'Internal error: Say what you expect to check as a string. Found `array`.')
    })
})

describe('checking - not opinionated', () => {
    const NotOpinionated = Object.create(Not)
    NotOpinionated.opinionated = false
    const notOpinionated = NotOpinionated.create()
    //string x string
    it('should return false when comparing string', () => {
        notOpinionated('string', '').should.be.false
    })

    //object x #String
    it('should return false when comparing #String to object', () => {
        notOpinionated('object', new String('foo')).should.be.false

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
        }).should.Throw(Error, 'Internal error: Say what you expect to check as a string. Found `array` as `object`.')
    })
})

describe('checking - not opinionated on NaN', () => {
    const NotOpinionatedOnNaN = Object.create(Not)
    NotOpinionatedOnNaN.opinionatedOnNaN = false
    const noonan = NotOpinionatedOnNaN.create()

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
        noonan('object', [], 'array').should.equal('Invalid Argument (array): Expect type `object` but got `array`.')
    })
})

describe('checking - not opinionated on array', () => {
    const NotOpinionatedOnArray = Object.create(Not)
    NotOpinionatedOnArray.opinionatedOnArray = false
    const nooa = NotOpinionatedOnArray.create()

    //string x #String
    it('should return false when comparing #String to string', () => {
        nooa('string', new String('foo')).should.be.false
    })

    //number x NaN
    it('should still be opinionated and return failure message when when comparing NaN as a number', () => {
        nooa(['number', 'object', 'string'], NaN).should.equal('Invalid Argument: Expect type `number`, `object` or `string` but got `nan`.')
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
    const NotOpinionatedOnNull = Object.create(Not)
    NotOpinionatedOnNull.opinionatedOnNull = false
    const noon = NotOpinionatedOnNull.create()

    //string x #String
    it('should return false when comparing #String to string', () => {
        noon('string', new String('foo')).should.be.false
    })

    //number x NaN
    it('should still be opinionated and return failure message when when comparing NaN as a number', () => {
        noon(['number', 'object', 'string'], NaN).should.equal('Invalid Argument: Expect type `number`, `object` or `string` but got `nan`.')
    })

    //object x []
    it('should still be opinionated and return failure message when comparing [] as object', () => {
        noon('object', [], 'array').should.equal('Invalid Argument (array): Expect type `object` but got `array`.')
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
    const NotOpinionatedOnString = Object.create(Not)
    NotOpinionatedOnString.opinionatedOnString = false
    const noos = NotOpinionatedOnString.create()

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
        noos('number', NaN).should.equal('Invalid Argument: Expect type `number` but got `nan`.')
    })

    //object x []
    it('should still be opinionated and return failure message when comparing [] as object', () => {
        noos('object', [], 'array').should.equal('Invalid Argument (array): Expect type `object` but got `array`.')
    })
})
