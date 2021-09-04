export default 
(
    key: string
): string => {
    return key.replace('$$custom_optional', 'optional(null or undefined)').replace('$$custom_', 'custom:')
}