export default 
(
    got: any,
    opinionFlags = {
        opinionatedOnNaN      : true
        ,
        opinionatedOnArray    : true
        ,
        opinionatedOnNull     : true
        ,
        opinionatedOnString   : true
        ,
        opinionatedOnNumber   : true
        ,
        opinionatedOnBoolean  : true
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
    
    else if (typeof got === 'object' && got instanceof Number) {
        // deal with the typeof new Number(NaN) being 'object'
        
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
    
    if (got instanceof String) {
        if (opinionFlags.opinionatedOnString === false) {
            return ['string', 'object']
        } else {
            return 'string'
        }
    }

    if (got instanceof Number) {
        if (opinionFlags.opinionatedOnNumber === false) {
            if( isNaN(got.valueOf()) ) return ['nan', 'object']
            return ['object']
        } else {
            if( isNaN(got.valueOf()) ) return 'nan'
            return 'number'
        }
    }

    if (got instanceof Boolean) {
        if (opinionFlags.opinionatedOnBoolean === false) {
            return ['boolean', 'object']
        } else {
            return 'boolean'
        }
    }
    return 'object'
}