'use strict'

const type = 'optional'
const define = {
    primitive: ['null', 'undefined']
}

module.exports = function(Not) {
    Not[`$$custom_${type}`] = define
    return Not
}