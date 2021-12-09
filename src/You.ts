'use strict'

import print from './lib/print'
import suffixCheck from './helpers/suffixCheck'
import { optionalReplace, optionalReplaceFn } from './helpers/optionalReplace'
import customNameReplace from './helpers/customNameReplace'
import typeOf from './helpers/typeOf'
import list from './helpers/list'
import msgPOJO from './core/msgPOJO'
import primitives from './core/primitives'
import NotTypeError from './core/NotTypeError'
import GenericObj from './core/types/GenericObj'
import DefineType from './core/types/DefineType'
import CallbackFn from './core/types/CallbackFn'
import AreNot from './core/types/AreNot'
import CreateOptions from './core/types/CreateOptions'
import Are from './core/types/Are'
import YouType from './core/types/You'

const You: YouType = {

      timestamp     : false
    , messageInPOJO : false
    , _primitives   : primitives
    , _lodged       : []

    // Opinions
    , opinionatedOnNaN      : true
    , opinionatedOnArray    : true
    , opinionatedOnNull     : true
    , _isOpinionated        : true

    // isOpinionated getters and setters
    // A "gang" value that will flip all opinions on/off
    , get isOpinionated() { return this._isOpinionated }
    , set isOpinionated(value) {
        this.opinionatedOnNaN      = value
        this.opinionatedOnArray    = value
        this.opinionatedOnNull     = value
        this._isOpinionated        = value
    }

    // Define whether will throw errors (true by default)
    , willThrowError  : true
    , get throw(): boolean { return this.willThrowError }
    , set throw(value) {
        this.willThrowError = value
    }

    // verbosity
    , get verbose(): boolean { return this.timestamp && this.messageInPOJO }
    , set verbose(value: boolean) {
        this.timestamp = this.messageInPOJO = value
    }

    // METHODS

    // You.#are is the core method for validation
    , are(
        expect: string | string[]
        , got: any
        , name?: string
        , note?: string
    ): boolean {
        return !this.areNot(expect, got)
    }

    // _are is validation help for internal use. Has a try/catch wrapper to prevent throwing errors.
    , _are(
        expect: string | string[]
        , got: any
        , name?: string
        , note?: string
    ): boolean {

        try {
            let fail = this.areNot(expect, got, name, note)
            if (typeof fail === 'string') return false
            return true
        } catch(error) {
            return false
        }
    
    }

    // You.#areNot is the core method for negative validation
    , areNot(
        expect: string | string[]
        , got: any
        , name?: string
        , note?: string
    ): boolean | typeof msgPOJO | string {

        expect = this.prepareExpect(expect)
        let gotType = typeOf(got, this)
        if (this.validate(expect, got, gotType)) return false
        let message = this.msg(expect, got, gotType, name, note)

        if (this.willThrowError) {
            var error: NotTypeError
            if (typeof message === 'object') {
                error = new NotTypeError(message.message)
                error.trace = message
            } else {
                error = new NotTypeError(message)
            }
            throw error
        }

        return message

    }

    // create is the default way to "instantiate"
    , create(

        options?: CreateOptions

    ): AreNot {
        let you = Object.create(this)
        you._lodged = []
        if (options) this._applyOptions(you, options)
        return you
    }

    , createNot( 
        options?: CreateOptions 
    ) {
        let you = Object.create(this)
        you._lodged = []
        if (options) this._applyOptions(you, options)
        return you.not.bind(you)
    }
    
    // createIs is the default way to make a simplified true/false method.
    // TODO why you.not
    , createIs(

        options?: CreateOptions

    ): Are {

        let you = Object.create(this)
        this._applyOptions(you, options)
        return you.are.bind(you)

    }

    // checkObject allows checking of typing with an object literal `{}`.
    , checkObject( 

        name: string
        , expectObject: GenericObj
        , gotObject: GenericObj

        , callback?: {
            callback?: CallbackFn
            , returnPayload?: boolean
            , exact?: boolean
        } | CallbackFn

    ): Object | string {

        // necessary run-time type-checking.
        this.areNot('string', name)
        this.areNot('object', expectObject)
        this.areNot('object', gotObject)
        this.areNot(['function', 'object', 'optional'], callback)
    
        // set up another object to not pollute the current one.
        let not = Object.create(this)
    
        if (typeof callback === 'function') {
            not.walkObject(name, expectObject, gotObject)
            return not.resolve(callback, null) // null to specify no payload
        }
        if (typeof callback === 'object') {
            let returnedPayload = null
    
            // walk payload
            if (callback.returnPayload === true) {
                returnedPayload = not.walkObject(name, expectObject, gotObject, true, callback.exact)
                if (returnedPayload === '$$empty$$') returnedPayload = null
            } else {
                not.walkObject(name, expectObject, gotObject, null, callback.exact)
            }
    
            // set callback
            if (typeof callback.callback === 'function') {
                callback = callback.callback
            } else {

                if (this.throw) {
                    // if callback is not defined
                    // set a default callback to throw errors
                    callback = function (
                        errors: boolean | Array<string | boolean | ReturnType<typeof msgPOJO>>
                        , payload
                    ) {
                        if (errors) { 
                            let toThrow = new NotTypeError('Wrong types provided. See `trace`.')
                            if (typeof errors !== 'boolean') toThrow.trace = errors
                            throw toThrow
                        }
                        return payload
                    }
                } else {
                    callback = function (
                        errors: boolean | Array<string | boolean | ReturnType<typeof msgPOJO>>
                        , payload
                    ) {
                        if (errors) return errors
                        return payload
                    }
                }
                
            }
    
            return not.resolve(callback, returnedPayload)
        }
        not.walkObject(name, expectObject, gotObject)
        return not.resolve()
    }    

    // customExpectHdlr handles custom types.
    , customExpectHdlr(
        r: string[]
        , expect: string
    ): string[] {
        if (this._primitives.indexOf(expect) === -1) {
            if (this[`$$custom_${expect}`] !== undefined) {
                r.push(`$$custom_${expect}`)
                return r
            }
            throw new NotTypeError(`Internal error: \`${expect}\` is not a valid type to check for.`)
        }
        r.push(expect)
        return r
    }
    
    // defineType allows users to define their own types/validation.
    , defineType(
    
        payload: DefineType
    
    ): void {
    
        let sanitised: DefineType | any = You.checkObject(
            'defineType'
            , {
                  primitive: ['string', 'array']
                , type: 'string'
                , pass: ['function', 'optional']
            }
            , payload
            , { returnPayload: true }
        )
    
        if (Array.isArray(sanitised)) {
            sanitised.forEach(el => {
                console.error(el)
            })
            throw new NotTypeError('Wrong inputs for #defineType.')
        }
        if (typeof sanitised.primitive === 'string') sanitised.primitive = [sanitised.primitive]
        sanitised.primitive.forEach((p: string) => {
            if (this._primitives.indexOf(p) === -1) throw new NotTypeError(`Internal error: \`${p}\` is not a valid primitive.`)
        })
    
        let key = `$$custom_${sanitised.type}`
        this[key] = { primitive: sanitised.primitive }
        if(sanitised.pass) this[key]['pass'] = sanitised.pass
    }


    // Messaging generator
    , msg(
        expect: string | string[]
        , got: any
        , gotType: string | string[]
        , name?: string
        , note?: string
    ): string | ReturnType<typeof msgPOJO> {

        let gotTypeListed = list(gotType)
        let msg = 'Wrong Type'
        msg += name ? ` (${name})` : ''
        msg += `: Expecting type ${list(expect)} but got ${gotTypeListed}`
        // no need to elaborate for null, undefined and nan
        msg += (['`null`', '`undefined`', '`nan`'].indexOf(gotTypeListed) > -1) ? '.' : ` with value of \`${print(got)}\`.`
        msg += note ? ` Note: ${note}.` : ''
        if (this.timestamp) msg += ` (TS: ${new Date().getTime()})`
    
        if (this.messageInPOJO) return msgPOJO(msg, expect, got, gotType, name, note)
        return msg
    
    }

    , msgProp(
        expect: string | false
        , got?: string
        , name?: string
        , note?: string
    ): string | ReturnType<typeof msgPOJO> {

        let msg = name ? ` (${name})` : ''
        msg += `Property`

        if (expect) {
            msg += ` \`${expect}\` is missing.`
        } else {
            msg += ` \`${got}\` exists but is not expected.`
        }

        msg += note ? ` Note: ${note}.` : ''
        if (this.timestamp) msg += ` (TS: ${new Date().getTime()})`
        if (!this.willThrowError && this.messageInPOJO) return msgPOJO(msg, expect, got, undefined, name, note)
        return msg
    
    }

    // #validate searches for the function to pass
    , validate(

        expect: string[]
        , got: any
        , gotType: string | string[]
    
    ): boolean {

        if (typeof gotType == 'string') gotType = [gotType]
    
        let validated = false
        
        for (let i=0; i<expect.length; i++) {
            let el = expect[i]
            if (el.indexOf('$$') > -1) {
    
                // the customs must pass or fail as a whole, not in part.
                let passing = this._are(this[el].primitive, got, customNameReplace(el))
                if (!passing) {
                    continue // if it doesn't pass the primitives check, no need to check further
                } else if (typeof this[el].pass === 'function') {
    
                    if (this[el].pass(got)) {
                        validated = true // if there is a pass function, must pass it
                        break
                    } else {
                        continue
                    }
    
                } else {
                    // there is no pass function to run. reaching here means it has passed.
                    validated = true
                    break
                }
    
            } else if (gotType.indexOf(el) !== -1) {
                validated = true
                break
            }
        }
        return validated
    }

    // #lodge is used for handling multiple errors, by storing them first in #_lodged[].
    , lodge(
    
        expect: string | string[]
        , got: any
        , name?: string
        , note?: string
        
    ): string | boolean | typeof msgPOJO {

        if (!this.hasOwnProperty('_lodged')) this._lodged = []

        let { _lodged } = this
        let lodge: ( string | boolean | typeof msgPOJO ) = false

        // don't let lodge throw error
        try {
            lodge = this.areNot(expect, got, name, note)
        } catch(error: any) {
            lodge = error.message
        }
        if (lodge) _lodged.push(lodge)
        return lodge

    }
    
    // #lodgeProp is used for handling multiple errors in missing or additional properties, by storing them first in #_lodged[].
    , lodgeProp(

        expect: string | string[]
        , got?: any
        , name?: string
        , note?: string
        
    ): string | boolean | typeof msgPOJO {

        if (!this.hasOwnProperty('_lodged')) this._lodged = []
        let lodge = this.msgProp(expect, got, name, note)
        this._lodged.push(lodge)
        return lodge

    }

    // prepareExpect is an abstraction that handles the `expect` argument passed in, allowing `expect` to be `string` or `array`.
    , prepareExpect( 

        expect: string | string[] 

    ): string[] {

        if (typeof expect === 'string') {
    
            expect = [ expect ]
    
        } else if (!Array.isArray(expect)) {
    
            let msg = `Internal error: Say what you expect to check as a string or array of strings.`
            msg += ` Found ${list(typeOf(expect, this), 'as')}.`
    
            throw new NotTypeError(msg)
            
        }
    
        let reducer = (
    
            r: string[]
            , expect: string
    
        ): string[] => {

            if (typeof expect !== 'string') throw new NotTypeError(`Internal error: Say what you expect to check as a string. Found ${list(typeOf(expect, this), 'as')}.`)
            expect = expect.toLowerCase()
            return this.customExpectHdlr(r, expect)

        }
    
        return expect.reduce(reducer, [])
    
    }

    // #resolve is used when checks are completed, and we are ready to give all the errors back.
    , resolve(
    
        callback: CallbackFn
        , returnedPayload: Object
    
    ): CallbackFn | null | boolean {

        let { _lodged, willThrowError } = this

        if (_lodged.length === 0) {
            return (typeof callback === 'function') ? callback(false, returnedPayload) : false
        }

        let lodged = _lodged.slice()

        this._lodged = [] // we need to use `this` to clear out the array by side-effects.
    
        if (typeof callback === 'function') return callback(lodged, returnedPayload)

        if (willThrowError) {
            let error = new NotTypeError('Wrong types provided. See `trace`.')
            error.trace = lodged
            throw error
        }
        return lodged
    }
    
    // walkObject recursively goes through the object literal passed in to conduct checking
    , walkObject(
    
        name: string
        , 
        expectObject: any
        , 
        gotObject: any
        , 
        returnPayload: GenericObj
        ,
        exact?: true
    
    ): GenericObj | string | undefined {

        if (returnPayload) var sanitisedPayload: any = {}
        
        let expectKeys = Object.keys(expectObject)

        // if we want to force the object to be exact
        // we will need to point out the additional properties on the payload
        // for missing properties, the code block below will take care of them
        if (exact) {
            
            let gotKeys = Object.keys(gotObject)
            let additionals = gotKeys.filter(gotKey => !expectKeys.includes(gotKey))

            additionals.forEach(additional => {
                this.lodgeProp(false, `${name ? name + '.' : ''}${additional}`)
            })

        }
        
        for(let i=0, keys = expectKeys; i<keys.length; i++) {
    
            let key = keys[i]
            let expect = expectObject[key]
            let optional: ( boolean | optionalReplaceFn ) = false
            let optionalString = '__optional'
    
            if (suffixCheck(key, '?')) {
                optional = optionalReplace('?')
            } else if (suffixCheck(key, optionalString)) {
                optional = optionalReplace(optionalString)
            }
    
            let keyCopy = optional ? optional(key) : key

            // if the key is missing and is compulsory
            if (!(keyCopy in gotObject) && !optional) {
                this.lodgeProp(`${name ? name + '.' : ''}${keyCopy}`)
                continue
            }
            let got = gotObject[keyCopy]
    
            // if object, walk further in
            // using typeof and other stuff for speed
            if (typeof expect === 'object' && expect !== null && !Array.isArray(expect)) {
                if (typeof got === 'object' && got !== null && !Array.isArray(expect)) {
                    let chunk = this.walkObject(`${name ? name + '.' : ''}${keyCopy}`, expect, got, returnPayload)
                    if (chunk === '$$empty$$') continue
                    if (returnPayload) {
                        sanitisedPayload[keyCopy] = got
                    }
                    continue
                } else {
                    if (optional) continue
                }
                this.lodge('object', got, `${name ? name + '.' : ''}${keyCopy}`)
                continue
            }
            if (optional) {
                if (Array.isArray(expect)) {
                    expect.push('optional')
                } else {
                    expect = [expect, 'optional']
                }
            }
            let fail = this.lodge(expect, got, `${name ? name + '.' : ''}${keyCopy}`)
            if (returnPayload && !fail && got) sanitisedPayload[keyCopy] = got
        }
        if(returnPayload) return (Object.keys(sanitisedPayload).length < 1) ? '$$empty$$' : sanitisedPayload
    }
    
    // _applyOptions is a helper to set up the options of descendant objects
    , _applyOptions(
        descendant: YouType
        , options: CreateOptions
    ): void {

        if(this._are('object', options)) {
            // Deprecated: willThrowError 
            if(this._are('boolean', options.willThrowError)) {
                console.warn('NotJS: Use of `willThrowError` is deprecated. Use `throw` insteead.')
                descendant.willThrowError = options.willThrowError
            }
            if(this._are('boolean', options.throw)) descendant.throw = options.throw
            if(this._are('boolean', options.verbose)) descendant.verbose = options.verbose
            if(this._are('boolean', options.timestamp)) descendant.timestamp = options.timestamp
            if(this._are('boolean', options.messageInPOJO)) descendant.messageInPOJO = options.messageInPOJO
    
            if(this._are('boolean', options.isOpinionated)) {
                descendant.isOpinionated = options.isOpinionated
                return
            }
    
            Object.keys(You).filter(key => key.indexOf('opinionatedOn') === 0).forEach((optionKey: string) => {
                if (this._are('boolean', options[optionKey])) descendant[optionKey] = options[optionKey]
            })
        }

    }


    // Additional overloads for semantics
    , not(
        expect: string | string[]
        , got: any
        , name?: string
        , note?: string
    ) {
        return this.areNot(expect, got, name, note)
    }

    , is(
        expect: string | string[]
        , got: any
        , name?: string
        , note?: string
    ) {
        return this.are(expect, got, name, note)
    }

    // scrub is a shorthand of #checkObject
    , scrub(

        name: string
        , expectObject: GenericObj
        , gotObject: GenericObj
        , exact?: boolean

    ): Object | string {
        return this.checkObject(name, expectObject, gotObject, { returnPayload: true, exact })
    }

    // expose NotTypeError
    , NotTypeError
}

export default You
module.exports = You
