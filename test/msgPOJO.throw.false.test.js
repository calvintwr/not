'use strict'

import NotProto from '../index.js'
import chai from 'chai'
import NotTypeError from '../js/core/NotTypeError.js'
chai.should()

const should = require('chai').should()
const Not = NotProto.create({ throw: false })

describe('messageInPOJO', () => {
    
    it('should return error in POJO', () => {
        let tsNot = Not.createNot({ messageInPOJO: true })

        let pojo = tsNot('array', 123)

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

    it('should return error with POJO using verbose', () => {
        let tsNot = Not.createNot({ verbose: true })

        let pojo = tsNot('array', 123)

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