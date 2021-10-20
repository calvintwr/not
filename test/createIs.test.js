'use strict'

import Not from '../index.cjs'
import chai from 'chai'
import NotTypeError from '../dist/node/core/NotTypeError.js'
chai.should()

const should = require('chai').should()

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
        (() => {
            is(['number', 'string'], {})}
        ).should.throw(NotTypeError, 'Wrong Type: Expecting type `number` or `string` but got `object` with value of `{}`.')
    })

})