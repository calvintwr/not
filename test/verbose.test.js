'use strict'

import Not from '../index.js'
import chai from 'chai'
import NotTypeError from '../dist/node/core/NotTypeError.js'
chai.should()

const should = require('chai').should()

describe('verbose', () => {
    
    it('should set verbose mode (timestamp=true, messagePOJO=true) when set to true', () => {
        let verboseNot = Not.create()
        verboseNot.verbose = true

        verboseNot.timestamp.should.be.true
        verboseNot.messageInPOJO.should.be.true
 
    })

    it('should disable verbose mode (timestamp=false, messagePOJO=false) when set to false', () => {
        let verboseNot = Not.create({ timestamp: true, messageInPOJO: true })
        verboseNot.verbose = false

        verboseNot.timestamp.should.be.false
        verboseNot.messageInPOJO.should.be.false
 
    })

})