'use strict'

import Not from '../../dist/node/You.js'
import integer from '../../dist/node/customs/integer.js'
import NotTypeError from '../../dist/node/core/NotTypeError.js'
integer(Not)
import chai from 'chai'
chai.should()

describe('custom type: integer', function() {
    it('should return false when candidate is integer', () => {
        Not.not('integer', 1).should.be.false
    })
    it('should throw error when candidate is not integer (string of 1)', () => {
        (()=> {
            Not.not('integer', "1")
        }).should.Throw(NotTypeError, 'Wrong Type: Expecting type `custom:integer` but got `string` with value of `1`.')
    })
    it('should throw error when candidate is not integer (float 1.1)', () => {
        (()=> {
            Not.not('integer', 1.1)
        }).should.Throw(NotTypeError, 'Wrong Type: Expecting type `custom:integer` but got `number` with value of `1.1`.')
    })
})