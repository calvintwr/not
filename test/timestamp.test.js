'use strict'

import Not from '../index.js'
import chai from 'chai'
import NotTypeError from '../js/core/NotTypeError.js'
chai.should()

const should = require('chai').should()

describe('timestamp', () => {

    it('should throw error with timestamp', () => {

        var message
        (() => {
            try {
                let tsNot = Not.createNot({ timestamp: true })
                tsNot('array', 123)
            } catch(error) {
                message = error.message
                throw error
            }
            

        }).should.Throw(NotTypeError)

        message.indexOf('(TS:').should.equal(73)
        
    })
    
})