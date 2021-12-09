import Not from './You'
import NotTypeError from './core/NotTypeError'

//@ts-ignore
import optional from './customs/optional.js'
//@ts-ignore
import integer from './customs/integer.js'

optional(Not)
integer(Not)

export default Not
exports = module.exports = Not
