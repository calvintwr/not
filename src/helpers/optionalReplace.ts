type optionalReplaceFn = (key: string) => string

const optionalReplace = (

    suffix: string
    
): optionalReplaceFn => {
    return function (key) {
        return key.substring(0, key.length - suffix.length)
    }
}

export { optionalReplace, optionalReplaceFn }
export default optionalReplace