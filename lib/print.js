'use strict'

function print(obj) {
    if(obj == null || typeof obj === 'string' || typeof obj === 'number') return String(obj);
    if(obj.length || Array.isArray(obj) || String(obj) === '[object Object]') {
        return JSON.stringify(obj)
        //return '[' + Array.prototype.map.call(obj, print).join(', ') + ']';
    }
    if(typeof HTMLElement !== 'undefined' && obj instanceof HTMLElement) return '<' + obj.nodeName.toLowerCase() + '>';
    if(typeof Text !== 'undefined' && obj instanceof Text) return '"' + obj.nodeValue + '"';
    if(obj.toString) return obj.toString();

    return String(obj);
}

module.exports = print