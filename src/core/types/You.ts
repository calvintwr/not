import GenericObj from "./GenericObj"
import DefineType from "./DefineType"
import Are from "./Are"
import AreNot from "./AreNot"
import CallbackFn from "./CallbackFn"
import CreateOptions from "./CreateOptions"
import NotTypeError from "../NotTypeError"

interface YouType  {

    [key: string]   : any

    throw           : boolean
    willThrowError  : boolean
    timestamp       : boolean
    messageInPOJO   : boolean

    // specific flags
    opinionatedOnNaN    : boolean
    opinionatedOnArray  : boolean
    opinionatedOnNull   : boolean

    // overall flags
    _isOpinionated  : boolean
    isOpinionated   : boolean

    checkObject: ( 
        name: string
        , expectObject: GenericObj
        , gotObject: GenericObj

        , callback?: {
            callback?: CallbackFn
            , returnPayload?: boolean
            , exact?: boolean
        } | CallbackFn
    ) => Object | string

    create: (options?: CreateOptions) => AreNot
    createNot: (options?: CreateOptions) => AreNot
    createIs: (options?: CreateOptions) => Are
    defineType: (definition: DefineType) => void
    is: Are
    not: AreNot
    scrub:(

        name: string
        , expectObject: GenericObj
        , gotObject: GenericObj
        , exact?: boolean
        
    ) => Object | string
    NotTypeError: typeof NotTypeError
}

export default YouType