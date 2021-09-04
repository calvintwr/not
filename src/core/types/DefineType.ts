type DefineType = {
    primitive: string | string[]
    type: string
    pass: (candidate: any) => boolean
}
export default DefineType