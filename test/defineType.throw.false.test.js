'use strict'

import NotProto from '../index.js'
import chai from 'chai'

chai.should()

const should = require('chai').should()
const Not = NotProto.create({ throw: false })

describe('defineType (throw=false)', () => {

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
        not.not('falsey', [null]).should.equal('Wrong Type: Expecting type `custom:falsey` but got `array` with value of `[null]`.')
        not.is('falsey', []).should.be.true
        not.is('falsey', undefined).should.be.true
        not.is(['falsey', 'function'], function() {}).should.be.true
    })

})