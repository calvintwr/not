'use strict'

import Not from '../index.js'
import chai from 'chai'
import NotTypeError from '../js/core/NotTypeError.js'
chai.should()

const should = require('chai').should()

describe('scrub', () => {
    it('should throw error when payload not matched', () => {
        var error
        (() => {
            let schema = {
                id: 'number',
                name: 'string'
            }

            // payload may be a parsed body from API-requestors, or function arguments
            let payloadWithTypeError = {
                id: "1", // this will error
                name: "foo"
            }

            try {
                Not.scrub(
                    'payloadWithTypeError',
                    schema,
                    payloadWithTypeError
                )
            } catch(err) {
                error = err
                throw error
            }
        }).should.throw(NotTypeError, 'Wrong types provided. See `trace`.')
        let trace = error.trace
        trace.should.have.members([
            'Wrong Type (payloadWithTypeError.id): Expecting type `number` but got `string` with value of `1`.'
        ])
        trace.length.should.equal(1)
    })

})
