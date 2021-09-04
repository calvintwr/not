
export default
(
            
    str: string
    ,
    suffix: string

): boolean => {
    return (str.indexOf(suffix) > -1 && str.indexOf(suffix) === str.length - suffix.length)
}
