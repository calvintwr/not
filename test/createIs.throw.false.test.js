'use strict'

import Not from '../index.cjs'
import chai from 'chai'

chai.should()

const should = require('chai').should()

describe('createIs (throw=false)', () => {
    const is = Not.createIs({ throw: false })

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