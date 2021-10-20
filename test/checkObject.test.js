'use strict'

import Not from '../index.cjs'
import chai from 'chai'
import NotTypeError from '../dist/node/core/NotTypeError.js'
chai.should()

const should = require('chai').should()

describe('checkObject', () => {

    it('should return false when objects (no optionals) match', () => {
        let n = Object.create(Not)
        n.checkObject('noOptionals', {
            string: 'string',
            null: 'null',
            object: {
                object: {
                    number: 'number',
                    boolean: 'boolean'
                }
            }
        }, {
            string: 'string',
            null: null,
            object: {
                object: {
                    number: 123,
                    boolean: false
                }
            }
        }).should.be.false
    })

    it('should return false when objects (with optionals) match', () => {
        let n = Object.create(Not)
        n.checkObject('optionals', {
            string: 'string',
            null: 'null',
            object: {
                object: {
                    number: 'number',
                    boolean: 'boolean'
                }
            },
            optional__optional: { array: 'array' }
        }, {
            string: 'string',
            null: null,
            object: {
                object: {
                    number: 123,
                    boolean: false
                }
            },
            optional: { array: [] }
        }).should.be.false
    })

    it('should return false when objects (with optionals using "?") match', () => {
        let n = Object.create(Not)
        n.checkObject('optionals', {
            string: 'string',
            null: 'null',
            object: {
                object: {
                    number: 'number',
                    boolean: 'boolean'
                }
            },
            "optional?": { array: 'array' }
        }, {
            string: 'string',
            null: null,
            object: {
                object: {
                    number: 123,
                    boolean: false
                }
            },
            optional: { array: [] }
        }).should.be.false
    })

    it('should return false when objects (with optionals using "?") match', () => {
        let n = Object.create(Not)

        n.checkObject('optionals', {
            string: 'string',
            null: 'null',
            object: {
                object: {
                    number: 'number',
                    boolean: 'boolean',
                    "optional?": 'string'
                }
            },
            "optional?": { array: 'array' },
            "anOptionalThatIsMissing?": 'function'
        }, {
            string: 'string',
            null: null,
            object: {
                object: {
                    number: 123,
                    boolean: false
                }
            },
            optional: { array: [] }
        }).should.be.false
    })

    it('should return false when objects (overloaded with optionals using "__optional", "?" and "optional") match', () => {
        let n = Object.create(Not)
        n.checkObject('optionals', {
            "string__optional?": ['string', 'object', 'optional'],
            null: 'null'
        }, {
            null: null
        }).should.be.false
    })

    it('should throw error when objects (with optionals) do not match', () => {

        var error;

        (() => {
            let n = Object.create(Not)

            let schema = {
                string: 'string',
                null: 'null',
                object: {
                    object: {
                        number: 'number',
                        boolean: 'boolean'
                    }
                },
                compulsoryObject: {
                    missing: 1
                },
                optional__optional: { array: 'array' }
            }
    
            let payload = {
                string: [],
                null: false,
                object: {
                    object: {
                        number: [],
                        boolean: function () {},
                        extraProperty: 'string'
                    }
                },
                optional: { array: [] }
            }

            try {
                n.checkObject('optionalsNoMatch', schema, payload)
            } catch (err) {
                error = err
                throw error
            }

        }).should.throw(NotTypeError, 'Wrong types provided. See `trace`.')
        error.trace.should.be.an('array')
        error.trace.should.include.members([
            'Wrong Type (optionalsNoMatch.string): Expecting type `string` but got `array` with value of `[]`.',
            'Wrong Type (optionalsNoMatch.null): Expecting type `null` but got `boolean` with value of `false`.',
            'Wrong Type (optionalsNoMatch.object.object.number): Expecting type `number` but got `array` with value of `[]`.',
            'Wrong Type (optionalsNoMatch.object.object.boolean): Expecting type `boolean` but got `function` with value of `function () {}`.',
            'Property `optionalsNoMatch.compulsoryObject` is missing.'
        ])
    })

    it('should return error array (throw = false) when objects (with optionals) do not match', () => {
        let n = Object.create(Not)
        n.throw = false
        let error = n.checkObject('optionalsNoMatch', {
            string: 'string',
            null: 'null',
            object: {
                object: {
                    number: 'number',
                    boolean: 'boolean'
                }
            },
            compulsoryObject: {
                missing: 1
            },
            optional__optional: { array: 'array' }
        }, {
            string: [],
            null: false,
            object: {
                object: {
                    number: [],
                    boolean: function () {},
                    extraProperty: 'string'
                }
            },
            optional: { array: [] }
        })

        error.should.be.an('array')
        error.length.should.equal(5)
        error.should.include.members([
            'Wrong Type (optionalsNoMatch.string): Expecting type `string` but got `array` with value of `[]`.',
            'Wrong Type (optionalsNoMatch.null): Expecting type `null` but got `boolean` with value of `false`.',
            'Wrong Type (optionalsNoMatch.object.object.number): Expecting type `number` but got `array` with value of `[]`.',
            'Wrong Type (optionalsNoMatch.object.object.boolean): Expecting type `boolean` but got `function` with value of `function () {}`.',
            'Property `optionalsNoMatch.compulsoryObject` is missing.'
        ])
    })

    it('should return error array when optional object do not match', () => {
        var error;
        (() => {
            let n = Object.create(Not)

            try {
                n.checkObject('optionalsMatch', {
                    optional__optional: { array: 'array' }
                }, {
                    optional: { array: null }
                })
            } catch(err) {
                error = err
                throw error
            }
        }).should.throw(NotTypeError, 'Wrong types provided. See `trace`.')

        error.trace.should.be.an('array')
        error.trace.should.include.members([
            'Wrong Type (optionalsMatch.optional.array): Expecting type `array` but got `null`.',
        ])
    })

    it('should return error array when optional object do not match', () => {

        let n = Object.create(Not)
        var error;

        (() => {
            try {
                n.checkObject('optionalsMatch', {
                    optional__optional: { array: 'array' }
                }, {
                    optional: { array: null }
                })
            } catch(err) {
                error = err
                throw error
            }
        }).should.throw(NotTypeError, 'Wrong types provided. See `trace`.')
        error.trace.length.should.equal(1)
        error.trace.should.include.members([
            'Wrong Type (optionalsMatch.optional.array): Expecting type `array` but got `null`.',
        ])
    })

    it('should return error (willThrowError = false) in callback', () => {

        let n = Object.create(Not)
        n.throw = false

        let errors = n.checkObject('optionalsMatch', {
            optional__optional: { array: 'array' }
        }, {
            optional: { array: null }
        }, function(errors, payload) {
            errors.should.be.an('array')
            errors.length.should.equal(1)
            errors.should.include.members([
                'Wrong Type (optionalsMatch.optional.array): Expecting type `array` but got `null`.',
            ])
            should.equal(payload, null)
        })

    })

    it('should return error (willThrowError = true) in callback (specified as options)', () => {
        let n = Object.create(Not)
        let schema = {
            optional__optional: { array: 'array' }
        }
        let candidate =  {
            optional: { array: null }
        }
        let callback = function(errors, payload) {
            errors.should.be.an('array')
            errors.length.should.equal(1)
            errors.should.include.members([
                'Wrong Type (optionalsMatch.optional.array): Expecting type `array` but got `null`.',
            ])
            should.equal(payload, null)
        }

        let errors = n.checkObject(
            'optionalsMatch',
            schema,
            candidate,
            {
                callback:  callback
            }
        )
    })

    it('should throw error when optional object do not match, even if returnPayload is true', () => {

        let n = Object.create(Not)
        var error;

        (() => {
            let schema = {
                optional__optional: { array: 'array' }
            }
    
            let payload = {
                optional: { array: 123 }
            }
    
            try{
                n.checkObject(
                    'optionalsMatch',
                    schema,
                    payload,
                    { returnPayload: true }
                )
            } catch(err) {
                error = err
                throw error
            }
        }).should.throw(NotTypeError, 'Wrong types provided. See `trace`.')

        error.trace.should.be.an('array')
        error.trace.length.should.equal(1)
        error.trace.should.include.members([
            'Wrong Type (optionalsMatch.optional.array): Expecting type `array` but got `number` with value of `123`.',
        ])
    })

    it('should return and sanitise payload (returnPayload = true) when objects match - deep nesting', () => {
        let n = Object.create(Not)
        let testFn = function() {}
        let schema = {
            optional__optional: { array: 'array'},
            object: { nested: 'function' }
        }

        let payload = {
            optional: { array: [] },
            object: { nested: testFn },
            toBeSanitised: 'test'
        }

        let sanitised = n.checkObject(
            'optionalsMatch',
            schema,
            payload,
            { returnPayload: true }
        )
        sanitised.should.be.an('object')
        sanitised.should.deep.equal({ optional: { array: [] }, object: { nested: testFn } })
    })

    it('should return and sanitised payload (returnPayload = true) and drop branches when there are no valid values (optional schema)', () => {
        let n = Object.create(Not)
        let schema = {
            optionalSanitise__optional: { "array?": ['array', 'optional'] }
        }

        let payload = {
            optionalSanitise: { noMatch: '1', noMatch2: 2 },
        }

        let checked = n.checkObject(
            'optionalsMatch',
            schema,
            payload,
            { returnPayload: true }
        )
        
        should.equal(checked, null)
    })

    it('should return and sanitise payload (returnPayload = true) and drop branches when there are no valid values', () => {
        let n = Object.create(Not)
        let schema = {
            optionalSanitise__optional: { array: ['array', 'optional'] }
        }

        let payload = {
            optionalSanitise: { noMatch: '1', noMatch2: 2 },
        }

        var error
        (() => {

            try {
                n.checkObject(
                    'optionalsMatch',
                    schema,
                    payload,
                    { returnPayload: true }
                )
            } catch (_error) {
                error = _error
                throw error
            }
        }).should.throw(NotTypeError, 'Wrong types provided. See `trace`.')

        error.trace.should.be.an('array')
        error.trace.length.should.equal(1)
        error.trace.should.include.members([
            'Property `optionalsMatch.optionalSanitise.array` is missing.',
        ])
    })

    it('should throw error when optional exist but nested properties do not match, and compulsory property do not match', () => {
        let n = Object.create(Not)

        var error;

        (() => {
            let schema = {
                optionalSanitise__optional: { array: ['array', 'optional'] },
                compulsorySanitise: { array: ['array', 'optional'] }
            }
    
            
            let payload = {
                optionalSanitise: { noMatch: '1', noMatch2: 2 },
                compulsorySanitise: { noMatch: {
                    nested: {
                        foo: 'bar'
                    }
                }}
            }
    
            try{
                n.checkObject(
                    'optionalsMatch',
                    schema,
                    payload
                )
            } catch(err) {
                error = err
                throw error
            }
        }).should.throw(NotTypeError, 'Wrong types provided. See `trace`.')
        let trace = error.trace 
        trace.should.include.members([
            'Property `optionalsMatch.optionalSanitise.array` is missing.',
            'Property `optionalsMatch.compulsorySanitise.array` is missing.'
        ])
        trace.length.should.equal(2)
    })

    it('should throw error to warn of compulsory property when there are no valid values', () => {
        let n = Object.create(Not)

        var error;

        (() => {
            let schema = {
                optionalSanitise__optional: { array: ['array', 'optional'] },
                compulsorySanitise: { array: ['array', 'optional'] }
            }
    
            
            let payload = {
                noMatch: 1
            }
    
            try{
                n.checkObject(
                    'optionalsMatch',
                    schema,
                    payload
                )
            } catch(err) {
                error = err
                throw error
            }
        }).should.throw(NotTypeError, 'Wrong types provided. See `trace`.')
        let trace = error.trace 
        trace.should.include.members([
            'Property `optionalsMatch.compulsorySanitise` is missing.'
        ])
        trace.length.should.equal(1)
    })

    it('should return false when schema contained only optionals, and nothing matched', () => {
        let n = Object.create(Not)

        let schema = {
            "optional1?": { array: ['array', 'optional'] },
            "optional2?": { array: ['array', 'optional'] }
        }

        
        let payload = {
            noMatch: 1
        }
        
        n.checkObject(
            'optionalsMatch',
            schema,
            payload
        ).should.be.false

    })

    it('should return null when schema contained only optionals, and nothing matched (returnPayload=true)', () => {
        let n = Object.create(Not)

        let schema = {
            "optional1?": { array: ['array', 'optional'] },
            "optional2?": { array: ['array', 'optional'] }
        }

        
        let payload = {
            noMatch: 1
        }
        
        should.equal(null, n.checkObject(
            'optionalsMatch',
            schema,
            payload,
            { returnPayload: true }
        ))

    })

    it('should throw error when schema does not match (exact = true)', () => {

        let n = Object.create(Not)
        var error;

        (() => {
            let schema = {
                expectedOnSchema: 'string'
            }
    
            let payload = {
                additionalOnPayload: 'test'
            }
    
            try{
                n.checkObject(
                    'schemaMismatch',
                    schema,
                    payload,
                    { exact: true }
                )
            } catch(err) {
                error = err
                throw error
            }
        }).should.throw(NotTypeError, 'Wrong types provided. See `trace`.')

        error.trace.should.be.an('array')
        error.trace.length.should.equal(2)
        error.trace.should.include.members([
            'Property `schemaMismatch.expectedOnSchema` is missing.',
            'Property `schemaMismatch.additionalOnPayload` exists but is not expected.'
        ])
    })
})
