import msgPOJO from '../msgPOJO'

type CallbackFn = (

    errors: boolean | Array<string | boolean | ReturnType<typeof msgPOJO>>
    , payload: any
    
) => any

export default CallbackFn