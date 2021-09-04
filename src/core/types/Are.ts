type Are = (
    expect: string | string[]
    , got: any
    , name: string
    , note?: string
) => boolean 

export default Are