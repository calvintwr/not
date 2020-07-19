'use strict'
const Not = require('./You.js')

require('./customs/optional.js')(Not)
require('./customs/integer.js')(Not)

let NotWontThrow = Object.create(Not)
NotWontThrow.willThrowError = false
Not.NotWontThrow = NotWontThrow

exports = module.exports = Object.create(Not)
