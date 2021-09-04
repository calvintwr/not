'use strict'

import Not from '../index.js'
import chai from 'chai'
chai.should()

const should = require('chai').should()

describe('lodge', () => {

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
