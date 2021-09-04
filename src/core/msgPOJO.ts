const msgPOJO = (

    message: string
    , expect: string | Array<string> | false
    , got: any
    , gotType?: string | Array<string>
    , name?: string | string[]
    , note?: string

) => {
    return {
        message
        , expect
        , got
        , gotType
        , name
        , note
        , timestamp: new Date().getTime()
    }
}

export default msgPOJO