'use strict'

import NotProto from '../index.cjs'
import chai from 'chai'
chai.should()

const should = require('chai').should()
const Not = NotProto.create({ throw: false })

describe('lodge (throw=false)', () => {

    it('should have _lodged array of length 2', () => {
        const you = Object.create(Not)
        you.lodge('string', new String())
        you.lodge('array', {})

        you._lodged.should.be.an('array')
        you._lodged.length.should.equal(2)
    })

    it('should return false when comparing matching case', () => {
        let you2 = Object.create(Not)
        you2.lodge('null', null).should.be.false
    })

})
