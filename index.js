/*!
 * You-Are-Not v1.0.0
 * (c) 2020 Calvin Tan
 * Released under the MIT License.
 */
'use strict'

const Not = {
    opinionatedOnNaN: true,
    opinionatedOnArray: true,
    opinionatedOnNull: true,
    opinionatedOnString: true,
    _opinionated: true
}

Object.defineProperty(Not, 'opinionated', {
    get() { return this._opinionated },
    set(value) {
        this._opinionated = value
        this.opinionatedOnNaN = value
        this.opinionatedOnArray = value
        this.opinionatedOnNull = value
        this.opinionatedOnString = value
    }
})

Not.checker = function(expect, got, name, note) {
    if (!Array.isArray(expect)) expect = [expect]
    got = this.type(got)
    if (this.found(expect, got)) return false
    return this.msg(expect, got, name, note)
}
Not.found = function(expect, got) {
    if (typeof got == 'string') got = [got]
    let found = expect.find(el => got.indexOf(this.vet(el)) !== -1 )
    return typeof found !== 'undefined'
}

Not.msg = function(expect, got, name, note) {
    let msg = 'Invalid Argument'
    msg += name ? ` (${name})` : ''
    msg += `: Expect type ${this.list(expect)} but got ${this.list(got)}.`
    msg += note ? ` Note: ${note}.` : ''
    return msg
}

Not.vet = function(el) {
    const valid = [
        'string',
        'number',
        'nan', // this is an opinion. NaN should not be of type number in the literal sense.
        'array',
        'object',
        'function',
        'boolean',
        'null',
        'undefined'
        // no support for symbol. should we care?
    ]
    if (typeof el !== 'string') throw new Error(`Internal error: Say what you expect to check as a string. Found ${this.list(this.type(el), 'as')}.`)
    if (valid.indexOf(el.toLowerCase()) === -1) throw new Error(`Internal error: \`${el}\` is not a valid type to check for. Please use only ${this.list(valid)}.`)
    return el
}

Not.list = function(array, conjunction) {
    if (!conjunction) conjunction = 'or'
    if (typeof array === 'string') array = [array]
    array = array.map(el => {
        return `\`${el.toLowerCase()}\``
    })
    if (array.length === 1) return array[0]
    if (array.length === 2) return array.join(` ${conjunction} `)
    return `${array.slice(0, -1).join(', ')} ${conjunction} ${array.slice(-1)}`
}

Not.type = function(got) {

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
    return 'object'
}

Not.create = function() {
    return this.checker.bind(this)
}

module.exports = Object.create(Not)
