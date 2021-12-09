import msgPOJO from "./msgPOJO"

interface IErrorConstructor {
    new(...args: any[]): Error;
}

// tslint:disable:max-line-length
/**
 * Workaround for custom errors when compiling typescript targeting 'ES5'.
 * see: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
 * @param {NotTypeError} error
 * @param newTarget the value of `new.target`
 * @param {Function} errorType
 * @param errorPrototype
 */
// tslint:enable:max-line-length
function fixError(
    error: NotTypeError
    , newTarget: IErrorConstructor
    , errorType: IErrorConstructor
    , errorPrototype = Error
) {
    Object.setPrototypeOf(error, errorType.prototype)

    // when an error constructor is invoked with the `new` operator
    if (newTarget === errorType) {

        if (!error.name) error.name = newTarget.name

        // exclude the constructor call of the error type from the stack trace.
        if (errorPrototype.captureStackTrace) {
            errorPrototype.captureStackTrace(error, errorType)
        } else {
            const stack = new errorPrototype(error.message).stack
            if (stack) {
                error.stack = fixStack(stack, `new ${newTarget.name}`, error.trace)
            }
        }
    }
}


function fixStack(
    stack: string
    , functionName: string
    , trace?: any
) {
    if (!stack) return stack;
    if (!functionName) return stack;
    // exclude lines starts with:  "  at functionName "
    const exclusion: RegExp = new RegExp(`\\s+at\\s${functionName}\\s`);

    const lines = stack.split('\n');
    const resultLines = lines.filter((line) => !line.match(exclusion));
    return resultLines.join('\n');
}

class NotTypeError extends TypeError {
    trace?: string[] | ReturnType<typeof msgPOJO> | Array<string | boolean | ReturnType<typeof msgPOJO>>
    statusCode?: number
    internalMessage: string

    constructor(message: ReturnType<typeof msgPOJO> | string, statusCode=400, debug?: any) {
        let msgStr = (typeof message === 'string') ? message : message.message
        super(msgStr)
        this.internalMessage = msgStr
        this.name = 'TypeError (NotTS)' // type error, invalid argument, validation error... have been considered. 'Wrong Type' sounds most simple.
        this.statusCode = statusCode
        if (typeof message === 'object') {
            this.trace = message
            if (typeof debug === 'function') debug(message)
        }


        fixError(this, new.target, NotTypeError, TypeError)
    }
}

export default NotTypeError
