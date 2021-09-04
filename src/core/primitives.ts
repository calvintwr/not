export default [
    'string',
    'number',
    'array',
    'object',
    'function',
    'boolean',
    'null',
    'undefined',
    'symbol',
    'nan' // this is an opinion. NaN should not be of type number in the literal sense.
] as const