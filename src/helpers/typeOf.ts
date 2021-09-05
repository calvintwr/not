export default 
(
    got: any,
    opinionFlags = {
        opinionatedOnNaN      : true
        ,
        opinionatedOnArray    : true
        ,
        opinionatedOnNull     : true
    }

): string | Array<string> => {

    // sort out the NaN problem.
    if (typeof got !== 'object') {
        if (typeof got === 'number' && isNaN(got)) {
            if (opinionFlags.opinionatedOnNaN === false) {
                return ['nan', 'number']
            } else {
                return 'nan'
            }
        }
        // everything else is in the clear
        return typeof got
    } 

    // objects... get rid of all the problems typeof [] or null is `object`.
    if (Array.isArray(got)) {
        if (opinionFlags.opinionatedOnArray === false) {
            return ['array', 'object']
        } else  {
            return 'array'
        }
    }
    
    if (got === null) {
        if (opinionFlags.opinionatedOnNull === false) {
            return ['null', 'object']
        } else {
            return 'null'
        }
    }
    
    return 'object'
}