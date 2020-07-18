/*!
 * You-Are-Not v0.6.2
 * (c) 2020 Calvin Tan
 * Released under the MIT License.
 */
'use strict'

const You = { willThrowError: true }

/* Core properties/methods */

// opinions
Object.defineProperty(You,
    '_opinions', {
        value: [
            'opinionatedOnNaN',
            'opinionatedOnArray',
            'opinionatedOnNull',
            'opinionatedOnString',
            'opinionatedOnNumber',
            'opinionatedOnBoolean'
        ]
    }
)

// isOpinionated
Object.defineProperty(You,
    'isOpinionated', {
        get() { return this._isOpinionated },
        set(value) {
            this._isOpinionated = value
            this._opinions.forEach(key => {
                this[key] = value
            })
        }, enumerable: true
    }
)
You.isOpinionated = true // set opionated mode by default

// areNot
Object.defineProperty(You,
    'areNot', {
        value: function(expect, got, name, note) {
            expect = this.prepareExpect(expect)
            let gotType = this.type(got)
            if (this.found(expect, got, gotType)) return false
            let msg = this.msg(expect, gotType, name, note)
            if (this.willThrowError) throw TypeError(msg)
            return msg
        }
    }
)

// are and _are (for internal use)
Object.defineProperties(You, {
    are: {
        value: function(expect, got, name, note) {
            let fail = this.areNot(expect, got)
            return !fail
        }
    },
    _are: {
        value: function(expect, got, name, note) {
            try {
                let fail = this.areNot(expect, got, name, note)
                if (typeof fail === 'string') return false
                return true
            } catch(error) {
                return false
            }
        }
    }
})

// primitives
Object.defineProperty(You,
    '_primitives', {
        value: [
            'string',
            'number',
            'array',
            'object',
            'function',
            'boolean',
            'null',
            'undefined',
            'symbol',
            'nan' // this is an opinion. NaN should not be of type number in the literal sense.
        ], enumerable: true
    }
)
/* End core properties */

You.isNot = function(expect, got, name, note) {
    return this.areNot(expect, got, name, note)
}
You.not = function(expect, got, name, note) {
    return this.areNot(expect, got, name, note)
}
You.is = function(expect, got, name, note) {
    return this.are(expect, got, name, note)
}

You.found = function(expect, got, gotType) {
    if (typeof gotType == 'string') gotType = [gotType]
    let found = false
    for (let i=0; i<expect.length; i++) {
        let el = expect[i]
        if (el.indexOf('$$') > -1) {

            // the customs must pass or fail as a whole, not in part.
            let passing = this._are(this[el].primitive, got, this.customNameReplace(el))
            if (!passing) {
                continue // if it doesn't pass the primitives check, no need to check further
            } else if (typeof this[el].pass === 'function') {
                if (this[el].pass(got)) {
                    found = true // if there is a pass function, must pass it
                    break
                } else {
                    continue
                }
            } else {
                // there is no pass function to run. reaching here means it has passed.
                found = true
                break
            }

        } else if (gotType.indexOf(el) !== -1) {
            found = true
            break
        }
    }
    return found
}

You.prepareExpect = function(expect) {
    if (typeof expect === 'string') {
        expect = [expect]
    } else if (!Array.isArray(expect)) {
        let x =  TypeError(`Internal error: Say what you expect to check as a string or array of strings. Found ${this.list(this.type(expect), 'as')}.`)
        throw x
    }
    //return expect
    return expect.reduce((r, expect) => {
        if (typeof expect !== 'string') throw TypeError(`Internal error: Say what you expect to check as a string. Found ${this.list(this.type(expect), 'as')}.`)
        expect = expect.toLowerCase()
        return this.mapExpect(r, expect)
    }, [])
}

You.mapExpect = function(r, expect) {
    if (this._primitives.indexOf(expect) === -1) {
        if (this[`$$custom_${expect}`] !== undefined) {
            r.push(`$$custom_${expect}`)
            return r
        }
        throw TypeError(`Internal error: \`${expect}\` is not a valid type to check for.`)
    }
    r.push(expect)
    return r
}

You.msg = function(expect, got, name, note) {
    let msg = 'Wrong Type' // type error, invalid argument, validation error... have been considered. 'Wrong Type' sounds most simple.
    msg += name ? ` (${name})` : ''
    msg += `: Expecting type ${this.list(expect)} but got ${this.list(got)}.`
    msg += note ? ` Note: ${note}.` : ''
    return msg
}

You.list = function(array, conjunction) {
    if (!conjunction) conjunction = 'or'
    if (typeof array === 'string') array = [array]
    array = array.map(el => {
        return `\`${el.toLowerCase()}\``
    })
    if (array.length === 1) return this.customNameReplace(array[0])
    if (array.length === 2) return this.customNameReplace(array.join(` ${conjunction} `))
    let prepared = `${array.slice(0, -1).join(', ')} ${conjunction} ${array.slice(-1)}`
    return this.customNameReplace(prepared)
}

You.customNameReplace = function(key) {
    return key.replace('$$custom_optional', 'optional(null or undefined)').replace('$$custom_', 'custom:')
}

You.type = function(got) {

    // sort out the NaN problem.
    if (typeof got !== 'object') {
        if (typeof got === 'number' && isNaN(got)) {
            if (this.opinionatedOnNaN) {
                return 'nan'
            } else {
                return ['nan', 'number']
            }
        }
        // everything else is in the clear
        return typeof got
    }

    // objects... get rid of all the problems typeof [] or null is `object`.
    if (Array.isArray(got)) {
        if (this.opinionatedOnArray) {
            return 'array'
        } else {
            return ['array', 'object']
        }
    }
    if (got === null) {
        if (this.opinionatedOnNull) {
            return 'null'
        } else {
            return ['null', 'object']
        }
    }

    if (got instanceof String) {
        if (this.opinionatedOnString) {
            return 'string'
        } else {
            return ['string', 'object']
        }
    }

    if (got instanceof Number) {
        if (this.opinionatedOnNumber) {
            if( isNaN(got.valueOf()) ) return 'nan'
            return 'number'
        } else {
            if( isNaN(got.valueOf()) ) return ['number', 'nan', 'object']
            return ['number', 'object']
        }
    }

    if (got instanceof Boolean) {
        if (this.opinionatedOnBoolean) {
            return 'boolean'
        } else {
            return ['boolean', 'object']
        }
    }
    return 'object'
}

You.lodge = function(expect, got, name, note) {
    if (!this._lodged) this._lodged = []
    let lodge = false

    // don't let lodge error
    try {
        lodge = this.areNot(expect, got, name, note)
    } catch(error) {
        lodge = error.message
    }
    if (lodge) this._lodged.push(lodge)
    return lodge
}

You.resolve = function(callback, returnedPayload) {
    if (this._lodged === undefined || this._lodged.length === 0) {
        return (typeof callback === 'function') ? callback(false, returnedPayload) : false
    }
    let lodged = this._lodged.slice()
    this._lodged = undefined
    if (typeof callback === 'function') return callback(lodged, returnedPayload)
    if (this.willThrowError) {
        let errors = TypeError('Wrong types provided. See `trace`.')
        errors.trace = lodged
        throw errors
    }
    return lodged
}

You.checkObject = function (name, expectObject, gotObject, callback) {
    // use #areNot because it's not configurable and writable.
    this.areNot('string', name)
    this.areNot('object', expectObject)
    this.areNot('object', gotObject)
    this.areNot(['function', 'object', 'optional'], callback)

    let not = Object.create(this)

    if (typeof callback === 'function') {
        not.walkObject(name, expectObject, gotObject)
        return not.resolve(callback, null) // null to specify no payload
    }
    if (typeof callback === 'object') {
        let returnedPayload = null

        // walk payload
        if (callback.returnPayload === true) {
            returnedPayload = not.walkObject(name, expectObject, gotObject, true)
            if (returnedPayload === '$$empty$$') returnedPayload = null
        } else {
            not.walkObject(name, expectObject, gotObject)
        }

        // set callback
        if (typeof callback.callback === 'function') {
            callback = callback.callback
        } else {
            callback = function (errors, payload) {
                if (errors) return errors
                return payload
            }
        }

        return not.resolve(callback, returnedPayload)
    }
    not.walkObject(name, expectObject, gotObject)
    return not.resolve()
}
You.walkObject = function (name, expectObject, gotObject, returnPayload) {
    if(returnPayload) var sanitisedPayload = {}
    for(let i=0, keys = Object.keys(expectObject); i<keys.length; i++) {
        let key = keys[i]
        let expect = expectObject[key]
        let optional = false
        let optionalString = '__optional'

        function _optionalReplace(suffix) {
            return function (key) {
                return key.substring(0, key.length - suffix.length)
            }
        }

        function _suffixCheck(str, suffix) {
            return (str.indexOf(suffix) > -1 && str.indexOf(suffix) === str.length - suffix.length)
        }

        if (_suffixCheck(key, '?')) {
            optional = _optionalReplace('?')
        } else if (_suffixCheck(key, optionalString)) {
            optional = _optionalReplace(optionalString)
        }

        let keyCopy = optional ? optional(key) : key
        let got = gotObject[keyCopy]

        // if object, walk further in
        // using typeof and other stuff for speed
        if (typeof expect === 'object' && expect !== null && !Array.isArray(expect)) {
            if (typeof got === 'object' && got !== null && !Array.isArray(expect)) {
                let chunk = this.walkObject(`${name}.${keyCopy}`, expect, got, returnPayload)
                if (chunk === '$$empty$$') continue
                if (returnPayload) {
                    sanitisedPayload[keyCopy] = got
                }
                continue
            } else {
                if (optional) continue
            }
            this.lodge('object', got, `${name}.${keyCopy}`)
            continue
        }
        if (optional) {
            if (Array.isArray(expect)) {
                expect.push('optional')
            } else {
                expect = [expect, 'optional']
            }
        }
        let fail = this.lodge(expect, got, `${name}.${keyCopy}`)
        if (returnPayload && !fail && got) sanitisedPayload[keyCopy] = got
    }
    if(returnPayload) return (Object.keys(sanitisedPayload).length < 1) ? '$$empty$$' : sanitisedPayload
}

You.defineType = function(payload) {
    // use prototype You's checkObject
    let sanitised = You.checkObject('defineType', {
        primitive: ['string', 'array'],
        type: 'string',
        pass: ['function', 'optional']
    }, payload, { returnPayload: true })

    if (Array.isArray(sanitised)) {
        sanitised.forEach(el => {
            console.error(el)
        })
        throw TypeError('Wrong inputs for #defineType.')
    }
    if (typeof sanitised.primitive === 'string') sanitised.primitive = [sanitised.primitive]
    sanitised.primitive.forEach(p => {
        if (this._primitives.indexOf(p) === -1) throw TypeError(`Internal error: \`${p}\` is not a valid primitive.`)
    })

    let key = `$$custom_${sanitised.type}`
    this[key] = { primitive: sanitised.primitive }
    if(sanitised.pass) this[key]['pass'] = sanitised.pass
}

You.create = function(options) {
    let you = Object.create(this)
    this._applyOptions(you, options)
    return you.areNot.bind(you)
}
You.createNot = function(options) {
    return this.create(options)
}
You.createIs = function(options) {
    let you = Object.create(this)
    this._applyOptions(you, options)
    return you.are.bind(you)
}

You._applyOptions = function (descendant, options) {
    //using #_are because it's not writable and configurable
    if(this._are('object', options)) {
        if(this._are('boolean', options.willThrowError)) descendant.willThrowError = options.willThrowError
        if(this._are('boolean', options.isOpinionated)) {
            descendant.isOpinionated = options.isOpinionated
            return
        }

        this._opinions.forEach(optionKey => {
            if (this._are('boolean', options[optionKey])) descendant[optionKey] = options[optionKey]
        })
    }
}

//Aggregators, or default non-primitive checks
You.$$custom_optional = {
    primitive: ['null', 'undefined']
}

let NotWontThrow = Object.create(You)
NotWontThrow.willThrowError = false
You.NotWontThrow = NotWontThrow

exports = module.exports = You
