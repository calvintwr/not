'use strict'

import Not from '../index.js'
import chai from 'chai'
import NotTypeError from '../dist/node/core/NotTypeError.js'
chai.should()

const should = require('chai').should()

describe('_are', () => {
    it('should return true when matched', () => {
        Not._are('array', []).should.be.true
    })
    it('should return false when not matched', () => {
        Not._are('object', []).should.be.false
    })
})