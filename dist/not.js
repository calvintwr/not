(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Not = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

function print(obj) {
  if (obj == null || typeof obj === 'string' || typeof obj === 'number') return String(obj);

  if (obj.length || Array.isArray(obj) || String(obj) === '[object Object]') {
    return JSON.stringify(obj); //return '[' + Array.prototype.map.call(obj, print).join(', ') + ']';
  }

  if (typeof HTMLElement !== 'undefined' && obj instanceof HTMLElement) return '<' + obj.nodeName.toLowerCase() + '>';
  if (typeof Text !== 'undefined' && obj instanceof Text) return '"' + obj.nodeValue + '"';
  if (obj.toString) return obj.toString();
  return String(obj);
}

module.exports = print;

},{}],2:[function(require,module,exports){
/*!
 * You-Are-Not v0.7.7
 * (c) 2020 Calvin Tan
 * Released under the MIT License.
 */
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var print = require('../lib/print.js');

var You = {
  willThrowError: true,
  timestamp: false,
  messageInPOJO: false
};
/* Core properties/methods */
// opinions

Object.defineProperty(You, '_opinions', {
  value: ['opinionatedOnNaN', 'opinionatedOnArray', 'opinionatedOnNull', 'opinionatedOnString', 'opinionatedOnNumber', 'opinionatedOnBoolean']
}); // isOpinionated

Object.defineProperty(You, 'isOpinionated', {
  get: function get() {
    return this._isOpinionated;
  },
  set: function set(value) {
    var _this = this;

    this._isOpinionated = value;

    this._opinions.forEach(function (key) {
      _this[key] = value;
    });
  },
  enumerable: true
});
You.isOpinionated = true; // set opionated mode by default
// areNot

Object.defineProperty(You, 'areNot', {
  value: function value(expect, got, name, note) {
    expect = this.prepareExpect(expect);
    var gotType = this.type(got);
    if (this.found(expect, got, gotType)) return false;
    var msg = this.msg(expect, got, gotType, name, note);
    if (this.willThrowError) throw TypeError(msg);
    return msg;
  }
}); // are and _are (for internal use)

Object.defineProperties(You, {
  are: {
    value: function value(expect, got, name, note) {
      var fail = this.areNot(expect, got);
      return !fail;
    }
  },
  _are: {
    value: function value(expect, got, name, note) {
      try {
        var fail = this.areNot(expect, got, name, note);
        if (typeof fail === 'string') return false;
        return true;
      } catch (error) {
        return false;
      }
    }
  }
}); // primitives

Object.defineProperty(You, '_primitives', {
  value: ['string', 'number', 'array', 'object', 'function', 'boolean', 'null', 'undefined', 'symbol', 'nan' // this is an opinion. NaN should not be of type number in the literal sense.
  ],
  enumerable: true
});
/* End core properties */

You.isNot = function (expect, got, name, note) {
  return this.areNot(expect, got, name, note);
};

You.not = function (expect, got, name, note) {
  return this.areNot(expect, got, name, note);
};

You.is = function (expect, got, name, note) {
  return this.are(expect, got, name, note);
};

You.found = function (expect, got, gotType) {
  if (typeof gotType == 'string') gotType = [gotType];
  var found = false;

  for (var i = 0; i < expect.length; i++) {
    var el = expect[i];

    if (el.indexOf('$$') > -1) {
      // the customs must pass or fail as a whole, not in part.
      var passing = this._are(this[el].primitive, got, this.customNameReplace(el));

      if (!passing) {
        continue; // if it doesn't pass the primitives check, no need to check further
      } else if (typeof this[el].pass === 'function') {
        if (this[el].pass(got)) {
          found = true; // if there is a pass function, must pass it

          break;
        } else {
          continue;
        }
      } else {
        // there is no pass function to run. reaching here means it has passed.
        found = true;
        break;
      }
    } else if (gotType.indexOf(el) !== -1) {
      found = true;
      break;
    }
  }

  return found;
};

You.prepareExpect = function (expect) {
  var _this2 = this;

  if (typeof expect === 'string') {
    expect = [expect];
  } else if (!Array.isArray(expect)) {
    var x = TypeError("Internal error: Say what you expect to check as a string or array of strings. Found ".concat(this.list(this.type(expect), 'as'), "."));
    throw x;
  } //return expect


  return expect.reduce(function (r, expect) {
    if (typeof expect !== 'string') throw TypeError("Internal error: Say what you expect to check as a string. Found ".concat(_this2.list(_this2.type(expect), 'as'), "."));
    expect = expect.toLowerCase();
    return _this2.mapExpect(r, expect);
  }, []);
};

You.mapExpect = function (r, expect) {
  if (this._primitives.indexOf(expect) === -1) {
    if (this["$$custom_".concat(expect)] !== undefined) {
      r.push("$$custom_".concat(expect));
      return r;
    }

    throw TypeError("Internal error: `".concat(expect, "` is not a valid type to check for."));
  }

  r.push(expect);
  return r;
};

You.msg = function (expect, got, gotType, name, note) {
  var msg = 'Wrong Type'; // type error, invalid argument, validation error... have been considered. 'Wrong Type' sounds most simple.

  var gotTypeListed = this.list(gotType);
  msg += name ? " (".concat(name, ")") : '';
  msg += ": Expecting type ".concat(this.list(expect), " but got ").concat(gotTypeListed); // no need to elaborate for null, undefined and nan

  msg += ['`null`', '`undefined`', '`nan`'].indexOf(gotTypeListed) > -1 ? '.' : ": ".concat(print(got), ".");
  msg += note ? " Note: ".concat(note, ".") : '';
  if (this.timestamp) msg += " (TS: ".concat(new Date().getTime(), ")");
  if (!this.willThrowError && this.messageInPOJO) return this.msgPOJO(msg, expect, got, gotType, name, note);
  return msg;
};

You.msgPOJO = function (message, expect, got, gotType, name, note) {
  return {
    message: message,
    expect: expect,
    got: got,
    gotType: gotType,
    name: name,
    note: note,
    timestamp: new Date().getTime()
  };
};

You.list = function (array, conjunction) {
  if (!conjunction) conjunction = 'or';
  if (typeof array === 'string') array = [array];
  array = array.map(function (el) {
    return "`".concat(el.toLowerCase(), "`");
  });
  if (array.length === 1) return this.customNameReplace(array[0]);
  if (array.length === 2) return this.customNameReplace(array.join(" ".concat(conjunction, " ")));
  var prepared = "".concat(array.slice(0, -1).join(', '), " ").concat(conjunction, " ").concat(array.slice(-1));
  return this.customNameReplace(prepared);
};

You.customNameReplace = function (key) {
  return key.replace('$$custom_optional', 'optional(null or undefined)').replace('$$custom_', 'custom:');
};

You.type = function (got) {
  // sort out the NaN problem.
  if (_typeof(got) !== 'object') {
    if (typeof got === 'number' && isNaN(got)) {
      if (this.opinionatedOnNaN) {
        return 'nan';
      } else {
        return ['nan', 'number'];
      }
    } // everything else is in the clear


    return _typeof(got);
  } // objects... get rid of all the problems typeof [] or null is `object`.


  if (Array.isArray(got)) {
    if (this.opinionatedOnArray) {
      return 'array';
    } else {
      return ['array', 'object'];
    }
  }

  if (got === null) {
    if (this.opinionatedOnNull) {
      return 'null';
    } else {
      return ['null', 'object'];
    }
  }

  if (got instanceof String) {
    if (this.opinionatedOnString) {
      return 'string';
    } else {
      return ['string', 'object'];
    }
  }

  if (got instanceof Number) {
    if (this.opinionatedOnNumber) {
      if (isNaN(got.valueOf())) return 'nan';
      return 'number';
    } else {
      if (isNaN(got.valueOf())) return ['number', 'nan', 'object'];
      return ['number', 'object'];
    }
  }

  if (got instanceof Boolean) {
    if (this.opinionatedOnBoolean) {
      return 'boolean';
    } else {
      return ['boolean', 'object'];
    }
  }

  return 'object';
};

You.lodge = function (expect, got, name, note) {
  if (!this._lodged) this._lodged = [];
  var lodge = false; // don't let lodge error

  try {
    lodge = this.areNot(expect, got, name, note);
  } catch (error) {
    lodge = error.message;
  }

  if (lodge) this._lodged.push(lodge);
  return lodge;
};

You.resolve = function (callback, returnedPayload) {
  if (this._lodged === undefined || this._lodged.length === 0) {
    return typeof callback === 'function' ? callback(false, returnedPayload) : false;
  }

  var lodged = this._lodged.slice();

  this._lodged = undefined;
  if (typeof callback === 'function') return callback(lodged, returnedPayload);

  if (this.willThrowError) {
    var errors = TypeError('Wrong types provided. See `trace`.');
    errors.trace = lodged;
    throw errors;
  }

  return lodged;
};

You.checkObject = function (name, expectObject, gotObject, callback) {
  // use #areNot because it's not configurable and writable.
  this.areNot('string', name);
  this.areNot('object', expectObject);
  this.areNot('object', gotObject);
  this.areNot(['function', 'object', 'optional'], callback);
  var not = Object.create(this);

  if (typeof callback === 'function') {
    not.walkObject(name, expectObject, gotObject);
    return not.resolve(callback, null); // null to specify no payload
  }

  if (_typeof(callback) === 'object') {
    var returnedPayload = null; // walk payload

    if (callback.returnPayload === true) {
      returnedPayload = not.walkObject(name, expectObject, gotObject, true);
      if (returnedPayload === '$$empty$$') returnedPayload = null;
    } else {
      not.walkObject(name, expectObject, gotObject);
    } // set callback


    if (typeof callback.callback === 'function') {
      callback = callback.callback;
    } else {
      callback = function callback(errors, payload) {
        if (errors) return errors;
        return payload;
      };
    }

    return not.resolve(callback, returnedPayload);
  }

  not.walkObject(name, expectObject, gotObject);
  return not.resolve();
};

You.scrub = function (name, expectObject, gotObject) {
  return this.checkObject(name, expectObject, gotObject, {
    returnPayload: true
  });
};

You.walkObject = function (name, expectObject, gotObject, returnPayload) {
  if (returnPayload) var sanitisedPayload = {};

  for (var i = 0, keys = Object.keys(expectObject); i < keys.length; i++) {
    var _optionalReplace = function _optionalReplace(suffix) {
      return function (key) {
        return key.substring(0, key.length - suffix.length);
      };
    };

    var _suffixCheck = function _suffixCheck(str, suffix) {
      return str.indexOf(suffix) > -1 && str.indexOf(suffix) === str.length - suffix.length;
    };

    var key = keys[i];
    var expect = expectObject[key];
    var optional = false;
    var optionalString = '__optional';

    if (_suffixCheck(key, '?')) {
      optional = _optionalReplace('?');
    } else if (_suffixCheck(key, optionalString)) {
      optional = _optionalReplace(optionalString);
    }

    var keyCopy = optional ? optional(key) : key;
    var got = gotObject[keyCopy]; // if object, walk further in
    // using typeof and other stuff for speed

    if (_typeof(expect) === 'object' && expect !== null && !Array.isArray(expect)) {
      if (_typeof(got) === 'object' && got !== null && !Array.isArray(expect)) {
        var chunk = this.walkObject("".concat(name, ".").concat(keyCopy), expect, got, returnPayload);
        if (chunk === '$$empty$$') continue;

        if (returnPayload) {
          sanitisedPayload[keyCopy] = got;
        }

        continue;
      } else {
        if (optional) continue;
      }

      this.lodge('object', got, "".concat(name, ".").concat(keyCopy));
      continue;
    }

    if (optional) {
      if (Array.isArray(expect)) {
        expect.push('optional');
      } else {
        expect = [expect, 'optional'];
      }
    }

    var fail = this.lodge(expect, got, "".concat(name, ".").concat(keyCopy));
    if (returnPayload && !fail && got) sanitisedPayload[keyCopy] = got;
  }

  if (returnPayload) return Object.keys(sanitisedPayload).length < 1 ? '$$empty$$' : sanitisedPayload;
};

You.defineType = function (payload) {
  var _this3 = this;

  // use prototype You's checkObject
  var sanitised = You.checkObject('defineType', {
    primitive: ['string', 'array'],
    type: 'string',
    pass: ['function', 'optional']
  }, payload, {
    returnPayload: true
  });

  if (Array.isArray(sanitised)) {
    sanitised.forEach(function (el) {
      console.error(el);
    });
    throw TypeError('Wrong inputs for #defineType.');
  }

  if (typeof sanitised.primitive === 'string') sanitised.primitive = [sanitised.primitive];
  sanitised.primitive.forEach(function (p) {
    if (_this3._primitives.indexOf(p) === -1) throw TypeError("Internal error: `".concat(p, "` is not a valid primitive."));
  });
  var key = "$$custom_".concat(sanitised.type);
  this[key] = {
    primitive: sanitised.primitive
  };
  if (sanitised.pass) this[key]['pass'] = sanitised.pass;
};

You.create = function (options) {
  var you = Object.create(this);

  this._applyOptions(you, options);

  return you.areNot.bind(you);
};

You.createNot = function (options) {
  return this.create(options);
};

You.createIs = function (options) {
  var you = Object.create(this);

  this._applyOptions(you, options);

  return you.are.bind(you);
};

You._applyOptions = function (descendant, options) {
  var _this4 = this;

  //using #_are because it's not writable and configurable
  if (this._are('object', options)) {
    if (this._are('boolean', options.willThrowError)) descendant.willThrowError = options.willThrowError;
    if (this._are('boolean', options.timestamp)) descendant.timestamp = options.timestamp;
    if (this._are('boolean', options.messageInPOJO)) descendant.messageInPOJO = options.messageInPOJO;

    if (this._are('boolean', options.isOpinionated)) {
      descendant.isOpinionated = options.isOpinionated;
      return;
    }

    this._opinions.forEach(function (optionKey) {
      if (_this4._are('boolean', options[optionKey])) descendant[optionKey] = options[optionKey];
    });
  }
};

module.exports = You;

},{"../lib/print.js":1}],3:[function(require,module,exports){
'use strict';

var type = 'integer';
var define = {
  primitive: ['number'],
  pass: function pass(candidate) {
    return candidate.toFixed(0) === candidate.toString();
  }
};

module.exports = function (Not) {
  Not["$$custom_".concat(type)] = define;
  return Not;
};

},{}],4:[function(require,module,exports){
'use strict';

var type = 'optional';
var define = {
  primitive: ['null', 'undefined']
};

module.exports = function (Not) {
  Not["$$custom_".concat(type)] = define;
  return Not;
};

},{}],5:[function(require,module,exports){
'use strict';

var Not = require('./You.js');

require('./customs/optional.js')(Not);

require('./customs/integer.js')(Not);

var NotWontThrow = Object.create(Not);
NotWontThrow.willThrowError = false;
Not.NotWontThrow = NotWontThrow;
exports = module.exports = Object.create(Not);

},{"./You.js":2,"./customs/integer.js":3,"./customs/optional.js":4}]},{},[5])(5)
});
