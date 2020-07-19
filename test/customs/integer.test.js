'use strict'

const Not = require('../../src/You.js')
require('../../src/customs/integer.js')(Not)
const should = require('chai').should()

describe('custom type: integer', function() {
    it('should return false when candidate is integer', () => {
        Not.not('integer', 1).should.be.false
    })
    it('should throw error when candidate is not integer (string of 1)', () => {
        (()=> {
            Not.not('integer', "1")
        }).should.Throw(TypeError, 'Wrong Type: Expecting type `custom:integer` but got `string`: 1.')
    })
    it('should throw error when candidate is not integer (float 1.1)', () => {
        (()=> {
            Not.not('integer', 1.1)
        }).should.Throw(TypeError, 'Wrong Type: Expecting type `custom:integer` but got `number`: 1.1.')
    })
})