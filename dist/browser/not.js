/*!
 * you-are-not v1.0.3
 * (c) 2020-2021 calvintwr
 * Release under MIT license.
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Not = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var print_1 = __importDefault(require("./lib/print"));

var suffixCheck_1 = __importDefault(require("./helpers/suffixCheck"));

var optionalReplace_1 = require("./helpers/optionalReplace");

var customNameReplace_1 = __importDefault(require("./helpers/customNameReplace"));

var typeOf_1 = __importDefault(require("./helpers/typeOf"));

var list_1 = __importDefault(require("./helpers/list"));

var msgPOJO_1 = __importDefault(require("./core/msgPOJO"));

var primitives_1 = __importDefault(require("./core/primitives"));

var NotTypeError_1 = __importDefault(require("./core/NotTypeError"));

var You = {
  timestamp: false,
  messageInPOJO: false,
  _primitives: primitives_1.default,
  _lodged: [] // Opinions
  ,
  opinionatedOnNaN: true,
  opinionatedOnArray: true,
  opinionatedOnNull: true,
  _isOpinionated: true // isOpinionated getters and setters
  // A "gang" value that will flip all opinions on/off
  ,

  get isOpinionated() {
    return this._isOpinionated;
  },

  set isOpinionated(value) {
    this.opinionatedOnNaN = value;
    this.opinionatedOnArray = value;
    this.opinionatedOnNull = value;
    this._isOpinionated = value;
  } // Define whether will throw errors (true by default)
  ,

  willThrowError: true,

  get throw() {
    return this.willThrowError;
  },

  set throw(value) {
    this.willThrowError = value;
  } // verbosity
  ,

  get verbose() {
    return this.timestamp && this.messageInPOJO;
  },

  set verbose(value) {
    this.timestamp = this.messageInPOJO = value;
  } // METHODS
  // You.#are is the core method for validation
  ,

  are: function are(expect, got, name, note) {
    return !this.areNot(expect, got);
  } // _are is validation help for internal use. Has a try/catch wrapper to prevent throwing errors.
  ,
  _are: function _are(expect, got, name, note) {
    try {
      var fail = this.areNot(expect, got, name, note);
      if (typeof fail === 'string') return false;
      return true;
    } catch (error) {
      return false;
    }
  } // You.#areNot is the core method for negative validation
  ,
  areNot: function areNot(expect, got, name, note) {
    expect = this.prepareExpect(expect);
    var gotType = typeOf_1.default(got, this);
    if (this.validate(expect, got, gotType)) return false;
    var message = this.msg(expect, got, gotType, name, note);

    if (this.willThrowError) {
      var error;

      if (_typeof(message) === 'object') {
        error = new NotTypeError_1.default(message.message);
        error.trace = message;
      } else {
        error = new NotTypeError_1.default(message);
      }

      throw error;
    }

    return message;
  } // create is the default way to "instantiate"
  ,
  create: function create(options) {
    var you = Object.create(this);
    you._lodged = [];
    if (options) this._applyOptions(you, options);
    return you;
  },
  createNot: function createNot(options) {
    var you = Object.create(this);
    you._lodged = [];
    if (options) this._applyOptions(you, options);
    return you.not.bind(you);
  } // createIs is the default way to make a simplified true/false method.
  // TODO why you.not
  ,
  createIs: function createIs(options) {
    var you = Object.create(this);

    this._applyOptions(you, options);

    return you.are.bind(you);
  } // checkObject allows checking of typing with an object literal `{}`.
  ,
  checkObject: function checkObject(name, expectObject, gotObject, callback) {
    // necessary run-time type-checking.
    this.areNot('string', name);
    this.areNot('object', expectObject);
    this.areNot('object', gotObject);
    this.areNot(['function', 'object', 'optional'], callback); // set up another object to not pollute the current one.

    var not = Object.create(this);

    if (typeof callback === 'function') {
      not.walkObject(name, expectObject, gotObject);
      return not.resolve(callback, null); // null to specify no payload
    }

    if (_typeof(callback) === 'object') {
      var returnedPayload = null; // walk payload

      if (callback.returnPayload === true) {
        returnedPayload = not.walkObject(name, expectObject, gotObject, true, callback.exact);
        if (returnedPayload === '$$empty$$') returnedPayload = null;
      } else {
        not.walkObject(name, expectObject, gotObject, null, callback.exact);
      } // set callback


      if (typeof callback.callback === 'function') {
        callback = callback.callback;
      } else {
        if (this.throw) {
          // if callback is not defined
          // set a default callback to throw errors
          callback = function callback(errors, payload) {
            if (errors) {
              var toThrow = new NotTypeError_1.default('Wrong types provided. See `trace`.');
              if (typeof errors !== 'boolean') toThrow.trace = errors;
              throw toThrow;
            }

            return payload;
          };
        } else {
          callback = function callback(errors, payload) {
            if (errors) return errors;
            return payload;
          };
        }
      }

      return not.resolve(callback, returnedPayload);
    }

    not.walkObject(name, expectObject, gotObject);
    return not.resolve();
  } // customExpectHdlr handles custom types.
  ,
  customExpectHdlr: function customExpectHdlr(r, expect) {
    if (this._primitives.indexOf(expect) === -1) {
      if (this["$$custom_" + expect] !== undefined) {
        r.push("$$custom_" + expect);
        return r;
      }

      throw new NotTypeError_1.default("Internal error: `" + expect + "` is not a valid type to check for.");
    }

    r.push(expect);
    return r;
  } // defineType allows users to define their own types/validation.
  ,
  defineType: function defineType(payload) {
    var _this = this;

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
      throw new NotTypeError_1.default('Wrong inputs for #defineType.');
    }

    if (typeof sanitised.primitive === 'string') sanitised.primitive = [sanitised.primitive];
    sanitised.primitive.forEach(function (p) {
      if (_this._primitives.indexOf(p) === -1) throw new NotTypeError_1.default("Internal error: `" + p + "` is not a valid primitive.");
    });
    var key = "$$custom_" + sanitised.type;
    this[key] = {
      primitive: sanitised.primitive
    };
    if (sanitised.pass) this[key]['pass'] = sanitised.pass;
  } // Messaging generator
  ,
  msg: function msg(expect, got, gotType, name, note) {
    var gotTypeListed = list_1.default(gotType);
    var msg = 'Wrong Type';
    msg += name ? " (" + name + ")" : '';
    msg += ": Expecting type " + list_1.default(expect) + " but got " + gotTypeListed; // no need to elaborate for null, undefined and nan

    msg += ['`null`', '`undefined`', '`nan`'].indexOf(gotTypeListed) > -1 ? '.' : " with value of `" + print_1.default(got) + "`.";
    msg += note ? " Note: " + note + "." : '';
    if (this.timestamp) msg += " (TS: " + new Date().getTime() + ")";
    if (this.messageInPOJO) return msgPOJO_1.default(msg, expect, got, gotType, name, note);
    return msg;
  },
  msgProp: function msgProp(expect, got, name, note) {
    var msg = name ? " (" + name + ")" : '';
    msg += "Property";

    if (expect) {
      msg += " `" + expect + "` is missing.";
    } else {
      msg += " `" + got + "` exists but is not expected.";
    }

    msg += note ? " Note: " + note + "." : '';
    if (this.timestamp) msg += " (TS: " + new Date().getTime() + ")";
    if (!this.willThrowError && this.messageInPOJO) return msgPOJO_1.default(msg, expect, got, undefined, name, note);
    return msg;
  } // #validate searches for the function to pass
  ,
  validate: function validate(expect, got, gotType) {
    if (typeof gotType == 'string') gotType = [gotType];
    var validated = false;

    for (var i = 0; i < expect.length; i++) {
      var el = expect[i];

      if (el.indexOf('$$') > -1) {
        // the customs must pass or fail as a whole, not in part.
        var passing = this._are(this[el].primitive, got, customNameReplace_1.default(el));

        if (!passing) {
          continue; // if it doesn't pass the primitives check, no need to check further
        } else if (typeof this[el].pass === 'function') {
          if (this[el].pass(got)) {
            validated = true; // if there is a pass function, must pass it

            break;
          } else {
            continue;
          }
        } else {
          // there is no pass function to run. reaching here means it has passed.
          validated = true;
          break;
        }
      } else if (gotType.indexOf(el) !== -1) {
        validated = true;
        break;
      }
    }

    return validated;
  } // #lodge is used for handling multiple errors, by storing them first in #_lodged[].
  ,
  lodge: function lodge(expect, got, name, note) {
    if (!this.hasOwnProperty('_lodged')) this._lodged = [];
    var _lodged = this._lodged;
    var lodge = false; // don't let lodge throw error

    try {
      lodge = this.areNot(expect, got, name, note);
    } catch (error) {
      lodge = error.message;
    }

    if (lodge) _lodged.push(lodge);
    return lodge;
  } // #lodgeProp is used for handling multiple errors in missing or additional properties, by storing them first in #_lodged[].
  ,
  lodgeProp: function lodgeProp(expect, got, name, note) {
    if (!this.hasOwnProperty('_lodged')) this._lodged = [];
    var lodge = this.msgProp(expect, got, name, note);

    this._lodged.push(lodge);

    return lodge;
  } // prepareExpect is an abstraction that handles the `expect` argument passed in, allowing `expect` to be `string` or `array`.
  ,
  prepareExpect: function prepareExpect(expect) {
    var _this = this;

    if (typeof expect === 'string') {
      expect = [expect];
    } else if (!Array.isArray(expect)) {
      var msg = "Internal error: Say what you expect to check as a string or array of strings.";
      msg += " Found " + list_1.default(typeOf_1.default(expect, this), 'as') + ".";
      throw new NotTypeError_1.default(msg);
    }

    var reducer = function reducer(r, expect) {
      if (typeof expect !== 'string') throw new NotTypeError_1.default("Internal error: Say what you expect to check as a string. Found " + list_1.default(typeOf_1.default(expect, _this), 'as') + ".");
      expect = expect.toLowerCase();
      return _this.customExpectHdlr(r, expect);
    };

    return expect.reduce(reducer, []);
  } // #resolve is used when checks are completed, and we are ready to give all the errors back.
  ,
  resolve: function resolve(callback, returnedPayload) {
    var _a = this,
        _lodged = _a._lodged,
        willThrowError = _a.willThrowError;

    if (_lodged.length === 0) {
      return typeof callback === 'function' ? callback(false, returnedPayload) : false;
    }

    var lodged = _lodged.slice();

    this._lodged = []; // we need to use `this` to clear out the array by side-effects.

    if (typeof callback === 'function') return callback(lodged, returnedPayload);

    if (willThrowError) {
      var error = new NotTypeError_1.default('Wrong types provided. See `trace`.');
      error.trace = lodged;
      throw error;
    }

    return lodged;
  } // walkObject recursively goes through the object literal passed in to conduct checking
  ,
  walkObject: function walkObject(name, expectObject, gotObject, returnPayload, exact) {
    var _this = this;

    if (returnPayload) var sanitisedPayload = {};
    var expectKeys = Object.keys(expectObject); // if we want to force the object to be exact
    // we will need to point out the additional properties on the payload
    // for missing properties, the code block below will take care of them

    if (exact) {
      var gotKeys = Object.keys(gotObject);
      var additionals = gotKeys.filter(function (gotKey) {
        return !expectKeys.includes(gotKey);
      });
      additionals.forEach(function (additional) {
        _this.lodgeProp(false, "" + (name ? name + '.' : '') + additional);
      });
    }

    for (var i = 0, keys = expectKeys; i < keys.length; i++) {
      var key = keys[i];
      var expect = expectObject[key];
      var optional = false;
      var optionalString = '__optional';

      if (suffixCheck_1.default(key, '?')) {
        optional = optionalReplace_1.optionalReplace('?');
      } else if (suffixCheck_1.default(key, optionalString)) {
        optional = optionalReplace_1.optionalReplace(optionalString);
      }

      var keyCopy = optional ? optional(key) : key; // if the key is missing and is compulsory

      if (!(keyCopy in gotObject) && !optional) {
        this.lodgeProp("" + (name ? name + '.' : '') + keyCopy);
        continue;
      }

      var got = gotObject[keyCopy]; // if object, walk further in
      // using typeof and other stuff for speed

      if (_typeof(expect) === 'object' && expect !== null && !Array.isArray(expect)) {
        if (_typeof(got) === 'object' && got !== null && !Array.isArray(expect)) {
          var chunk = this.walkObject("" + (name ? name + '.' : '') + keyCopy, expect, got, returnPayload);
          if (chunk === '$$empty$$') continue;

          if (returnPayload) {
            sanitisedPayload[keyCopy] = got;
          }

          continue;
        } else {
          if (optional) continue;
        }

        this.lodge('object', got, "" + (name ? name + '.' : '') + keyCopy);
        continue;
      }

      if (optional) {
        if (Array.isArray(expect)) {
          expect.push('optional');
        } else {
          expect = [expect, 'optional'];
        }
      }

      var fail = this.lodge(expect, got, "" + (name ? name + '.' : '') + keyCopy);
      if (returnPayload && !fail && got) sanitisedPayload[keyCopy] = got;
    }

    if (returnPayload) return Object.keys(sanitisedPayload).length < 1 ? '$$empty$$' : sanitisedPayload;
  } // _applyOptions is a helper to set up the options of descendant objects
  ,
  _applyOptions: function _applyOptions(descendant, options) {
    var _this = this;

    if (this._are('object', options)) {
      // Deprecated: willThrowError 
      if (this._are('boolean', options.willThrowError)) {
        console.warn('NotJS: Use of `willThrowError` is deprecated. Use `throw` insteead.');
        descendant.willThrowError = options.willThrowError;
      }

      if (this._are('boolean', options.throw)) descendant.throw = options.throw;
      if (this._are('boolean', options.verbose)) descendant.verbose = options.verbose;
      if (this._are('boolean', options.timestamp)) descendant.timestamp = options.timestamp;
      if (this._are('boolean', options.messageInPOJO)) descendant.messageInPOJO = options.messageInPOJO;

      if (this._are('boolean', options.isOpinionated)) {
        descendant.isOpinionated = options.isOpinionated;
        return;
      }

      Object.keys(You).filter(function (key) {
        return key.indexOf('opinionatedOn') === 0;
      }).forEach(function (optionKey) {
        if (_this._are('boolean', options[optionKey])) descendant[optionKey] = options[optionKey];
      });
    }
  } // Additional overloads for semantics
  ,
  not: function not(expect, got, name, note) {
    return this.areNot(expect, got, name, note);
  },
  is: function is(expect, got, name, note) {
    return this.are(expect, got, name, note);
  } // scrub is a shorthand of #checkObject
  ,
  scrub: function scrub(name, expectObject, gotObject) {
    return this.checkObject(name, expectObject, gotObject, {
      returnPayload: true
    });
  }
};
exports.default = You;
module.exports = You;

},{"./core/NotTypeError":2,"./core/msgPOJO":3,"./core/primitives":4,"./helpers/customNameReplace":7,"./helpers/list":8,"./helpers/optionalReplace":9,"./helpers/suffixCheck":10,"./helpers/typeOf":11,"./lib/print":13}],2:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
}); // tslint:disable:max-line-length

/**
 * Workaround for custom errors when compiling typescript targeting 'ES5'.
 * see: https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
 * @param {NotTypeError} error
 * @param newTarget the value of `new.target`
 * @param {Function} errorType
 * @param errorPrototype
 */
// tslint:enable:max-line-length

function fixError(error, newTarget, errorType, errorPrototype) {
  if (errorPrototype === void 0) {
    errorPrototype = Error;
  }

  Object.setPrototypeOf(error, errorType.prototype); // when an error constructor is invoked with the `new` operator

  if (newTarget === errorType) {
    if (!error.name) error.name = newTarget.name; // exclude the constructor call of the error type from the stack trace.

    if (errorPrototype.captureStackTrace) {
      errorPrototype.captureStackTrace(error, errorType);
    } else {
      var stack = new errorPrototype(error.message).stack;

      if (stack) {
        error.stack = fixStack(stack, "new " + newTarget.name, error.trace);
      }
    }
  }
}

function fixStack(stack, functionName, trace) {
  if (!stack) return stack;
  if (!functionName) return stack; // exclude lines starts with:  "  at functionName "

  var exclusion = new RegExp("\\s+at\\s" + functionName + "\\s");
  var lines = stack.split('\n');
  var resultLines = lines.filter(function (line) {
    return !line.match(exclusion);
  });
  return resultLines.join('\n');
}

var NotTypeError =
/** @class */
function (_super) {
  __extends(NotTypeError, _super);

  function NotTypeError(message, statusCode, debug) {
    var _newTarget = this.constructor;

    if (statusCode === void 0) {
      statusCode = 400;
    }

    var _this = this;

    var msgStr = typeof message === 'string' ? message : message.message;
    _this = _super.call(this, msgStr) || this;
    _this.name = 'TypeError (NotTS)'; // type error, invalid argument, validation error... have been considered. 'Wrong Type' sounds most simple.

    _this.statusCode = statusCode;

    if (_typeof(message) === 'object') {
      _this.trace = message;
      if (typeof debug === 'function') debug(message);
    }

    fixError(_this, _newTarget, NotTypeError, TypeError);
    return _this;
  }

  return NotTypeError;
}(TypeError);

exports.default = NotTypeError;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var msgPOJO = function msgPOJO(message, expect, got, gotType, name, note) {
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

exports.default = msgPOJO;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ['string', 'number', 'array', 'object', 'function', 'boolean', 'null', 'undefined', 'symbol', 'nan' // this is an opinion. NaN should not be of type number in the literal sense.
];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var type = 'integer';
var define = {
  primitive: ['number'],
  pass: function pass(candidate) {
    return candidate.toFixed(0) === candidate.toString();
  }
};

var append = function append(Not) {
  Not["$$custom_" + type] = define;
  return Not;
};

exports.default = append;
module.exports = append;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var type = 'optional';
var define = {
  primitive: ['null', 'undefined']
};

var append = function append(Not) {
  Not["$$custom_" + type] = define;
  return Not;
};

exports.default = append;
module.exports = append;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (key) {
  return key.replace('$$custom_optional', 'optional(null or undefined)').replace('$$custom_', 'custom:');
};

},{}],8:[function(require,module,exports){
"use strict";

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var customNameReplace_1 = __importDefault(require("./customNameReplace"));

exports.default = function (array, conjunction) {
  if (conjunction === void 0) {
    conjunction = 'or';
  }

  if (typeof array === 'string') array = [array];
  array = array.map(function (el) {
    return "`" + el.toLowerCase() + "`";
  });
  if (array.length === 1) return customNameReplace_1.default(array[0]);
  if (array.length === 2) return customNameReplace_1.default(array.join(" " + conjunction + " "));
  var prepared = array.slice(0, -1).join(', ') + " " + conjunction + " " + array.slice(-1);
  return customNameReplace_1.default(prepared);
};

},{"./customNameReplace":7}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionalReplace = void 0;

var optionalReplace = function optionalReplace(suffix) {
  return function (key) {
    return key.substring(0, key.length - suffix.length);
  };
};

exports.optionalReplace = optionalReplace;
exports.default = optionalReplace;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (str, suffix) {
  return str.indexOf(suffix) > -1 && str.indexOf(suffix) === str.length - suffix.length;
};

},{}],11:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (got, opinionFlags) {
  if (opinionFlags === void 0) {
    opinionFlags = {
      opinionatedOnNaN: true,
      opinionatedOnArray: true,
      opinionatedOnNull: true
    };
  } // sort out the NaN problem.


  if (_typeof(got) !== 'object') {
    if (typeof got === 'number' && isNaN(got)) {
      if (opinionFlags.opinionatedOnNaN === false) {
        return ['nan', 'number'];
      } else {
        return 'nan';
      }
    } // everything else is in the clear


    return _typeof(got);
  } // objects... get rid of all the problems typeof [] or null is `object`.


  if (Array.isArray(got)) {
    if (opinionFlags.opinionatedOnArray === false) {
      return ['array', 'object'];
    } else {
      return 'array';
    }
  }

  if (got === null) {
    if (opinionFlags.opinionatedOnNull === false) {
      return ['null', 'object'];
    } else {
      return 'null';
    }
  }

  return 'object';
};

},{}],12:[function(require,module,exports){
"use strict";

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var You_1 = __importDefault(require("./You")); //@ts-ignore


var optional_js_1 = __importDefault(require("./customs/optional.js")); //@ts-ignore


var integer_js_1 = __importDefault(require("./customs/integer.js"));

optional_js_1.default(You_1.default);
integer_js_1.default(You_1.default);
exports.default = You_1.default;
module.exports = You_1.default;

},{"./You":1,"./customs/integer.js":5,"./customs/optional.js":6}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (obj) {
  if (obj == null || typeof obj === 'string' || typeof obj === 'number') return String(obj);

  if (obj.length || Array.isArray(obj) || String(obj) === '[object Object]') {
    return JSON.stringify(obj);
  }

  if (typeof HTMLElement !== 'undefined' && obj instanceof HTMLElement) return '<' + obj.nodeName.toLowerCase() + '>';
  if (typeof Text !== 'undefined' && obj instanceof Text) return '"' + obj.nodeValue + '"';
  if (obj.toString) return obj.toString();
  return String(obj);
};

},{}]},{},[12])(12)
});
