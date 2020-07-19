'use strict'

const type = 'integer'
const define = {
    primitive: ['number'],
    pass: function(candidate) {
        return candidate.toFixed(0) === candidate.toString()
    }
}

module.exports = function(Not) {
    Not[`$$custom_${type}`] = define
    return Not
}