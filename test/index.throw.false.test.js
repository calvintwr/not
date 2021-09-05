'use strict'

//const Not = require('../index.js')
// ES6
import NotProto from '../index.js'
const Not = NotProto.create({ throw: false })

// ES6 Shorthand
//import { NotWontThrow as Not } from '../index.js'

const should = require('chai').should()

describe('checking (throw=false)', () => {
    describe('checking - opinionated via #create', () => {
        const not = Not.createNot()
        //string x string
        it('should return false when comparing string', () => {
            not('string', '').should.be.false
        })

        //string x #String
        it('should return false when comparing #String with string', () => {
            not('string', new String('foo')).should.equal('Wrong Type: Expecting type `string` but got `object` with value of `"foo"`.')
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
            not('number', new Number(NaN)).should.equal('Wrong Type: Expecting type `number` but got `object` with value of `NaN`.')
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
            not('object', ['foobar'], 'array')
                .should.equal('Wrong Type (array): Expecting type `object` but got `array` with value of `["foobar"]`.')
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
            not('boolean', new Boolean(false)).should.equal('Wrong Type: Expecting type `boolean` but got `object` with value of `false`.')
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
        it('should return error when comparing array or string with #String', () => {
            not(['array', 'string'], new String()).should.equal('Wrong Type: Expecting type `array` or `string` but got `object` with value of ``.')
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
            not('optional', function () {}).should.equal('Wrong Type: Expecting type `optional(null or undefined)` but got `function` with value of `function () {}`.')
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

        it('should throw error when passing expect as non-string', () => {
            (()=> {
                notOpinionated([[], 'string'], new String())
            }).should.Throw(TypeError, 'Internal error: Say what you expect to check as a string. Found `array` as `object`.')
        })
    })

    describe('checking - not opinionated on NaN', () => {
        const noonan = Not.createNot({
            opinionatedOnNaN: false
        })

        //number x NaN
        it('should return false when comparing NaN as a number', () => {
            noonan('number', NaN).should.be.false
        })

        //object x []
        it('should still be opinionated and return failure message when comparing [] as object', () => {
            noonan('object', [], 'array').should.equal('Wrong Type (array): Expecting type `object` but got `array` with value of `[]`.')
        })
    })

    describe('checking - not opinionated on array', () => {
        const nooa = Not.createNot({
            opinionatedOnArray: false
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
        const noon = Not.createNot({
            opinionatedOnNull: false
        })

        //number x NaN
        it('should still be opinionated and return failure message when when comparing NaN as a number', () => {
            noon(['number', 'object', 'string'], NaN).should.equal('Wrong Type: Expecting type `number`, `object` or `string` but got `nan`.')
        })

        //object x []
        it('should still be opinionated and return failure message when comparing [] as object', () => {
            noon('object', [], 'array').should.equal('Wrong Type (array): Expecting type `object` but got `array` with value of `[]`.')
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

    describe('checking - willThrowError turned on', () => {
        const nwt = Not.createNot({
            willThrowError: true
        })

        //string x object
        it('should throw error when comparing string with object', () => {
            (()=> {
                nwt(['string'], {foo: 'bar'})
            }).should.Throw(TypeError, 'Wrong Type: Expecting type `string` but got `object` with value of `{"foo":"bar"}`.')
        })
    })
})