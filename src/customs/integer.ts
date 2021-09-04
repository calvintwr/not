'use strict'

const type = 'integer'
const define = {
    primitive: ['number'],
    pass: function(candidate: any) {
        return candidate.toFixed(0) === candidate.toString()
    }
}
const append = (Not: any) => {
    Not[`$$custom_${type}`] = define
    return Not
}

export default append
module.exports = append