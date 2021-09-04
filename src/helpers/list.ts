import customNameReplace from './customNameReplace'


export default 
(

    array: string | Array<string>
    , 
    conjunction = 'or'

): string => {

    if (typeof array === 'string') array = [array]
    array = array.map(el => {
        return `\`${el.toLowerCase()}\``
    })

    if (array.length === 1) return customNameReplace(array[0])
    if (array.length === 2) return customNameReplace(array.join(` ${conjunction} `))
    
    let prepared = `${array.slice(0, -1).join(', ')} ${conjunction} ${array.slice(-1)}`
    return customNameReplace(prepared)

}
