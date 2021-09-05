'use strict'

import NotProto from '../index.js'
import chai from 'chai'
import NotTypeError from '../dist/node/core/NotTypeError.js'
chai.should()

const should = require('chai').should()
const Not = NotProto.create({ throw: false })

describe('_are (throw=false)', () => {

    it('should return true when matched', () => {
        Not._are('array', []).should.be.true
    })
    it('should return false when not matched', () => {
        Not._are('object', []).should.be.false
    })

})