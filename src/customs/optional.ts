'use strict'

const type = 'optional'
const define = {
    primitive: ['null', 'undefined']
}
const append = (Not: any) => {
    Not[`$$custom_${type}`] = define
    return Not
}

export default append
module.exports = append