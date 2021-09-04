export default interface CreateOptions {
    [key: string]: boolean

    throw: boolean
    verbose: boolean
    willThrowError: boolean
    timestamp: boolean
    messageInPOJO: boolean
    isOpinionated: boolean

    // specific flags
    opinionatedOnNaN: boolean
    opinionatedOnArray: boolean
    opinionatedOnNull: boolean
    opinionatedOnString: boolean
    opinionatedOnNumber: boolean
    opinionatedOnBoolean: boolean
}