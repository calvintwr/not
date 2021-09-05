'use strict'

import Not from '../index.js'
import chai from 'chai'
import NotTypeError from '../dist/node/core/NotTypeError.js'
chai.should()

const should = require('chai').should()

describe('messageInPOJO', () => {
    
    it('should throw error with POJO', () => {
        let tsNot = Not.createNot({ messageInPOJO: true })

        var error
        (() => {
            try {
                tsNot('array', 123)
            } catch (err) {
                error = err
                throw error
            }
        }).should.Throw(NotTypeError)

        let pojo = error.trace
        pojo.should.include({
            got: 123,
            gotType: 'number'
        })
        Object.keys(pojo).should.have.members([
            'expect',
            'got',
            'gotType',
            'name',
            'note',
            'timestamp',
            'message'
        ])
        pojo.expect.should.have.members([ 'array'])  
    })

    it('should throw error with POJO using verbose', () => {
        let tsNot = Not.createNot({ verbose: true })

        var error
        (() => {
            try {
                tsNot('array', 123)
            } catch (err) {
                error = err
                throw error
            }
        }).should.Throw(NotTypeError)

        let pojo = error.trace
        pojo.should.include({
            got: 123,
            gotType: 'number'
        })
        Object.keys(pojo).should.have.members([
            'expect',
            'got',
            'gotType',
            'name',
            'note',
            'timestamp',
            'message'
        ])
        pojo.expect.should.have.members([ 'array'])  
    })
})