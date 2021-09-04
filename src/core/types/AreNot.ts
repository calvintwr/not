import msgPOJO from "../msgPOJO"

type AreNot = (
    
    expect: string | string[]
    , got: any
    , name?: string
    , note?: string

) => string | boolean | typeof msgPOJO

export default AreNot
