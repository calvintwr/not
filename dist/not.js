(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Not = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * You-Are-Not v0.5.1
 * (c) 2020 Calvin Tan
 * Released under the MIT License.
 */
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var You = {
  opinionatedOnNaN: true,
  opinionatedOnArray: true,
  opinionatedOnNull: true,
  opinionatedOnString: true,
  _isOpinionated: true,
  willThrowError: true
};
/* Core properties */

Object.defineProperty(You, 'isOpinionated', {
  get: function get() {
    return this._isOpinionated;
  },
  set: function set(value) {
    this._isOpinionated = value;
    this.opinionatedOnNaN = value;
    this.opinionatedOnArray = value;
    this.opinionatedOnNull = value;
    this.opinionatedOnString = value;
  }
});
Object.defineProperty(You, 'areNot', {
  value: function value(expect, got, name, note) {
    // a prepare function
    expect = this.prepareExpect(expect);
    var gotType = this.type(got);
    if (this.found(expect, got, gotType)) return false;
    var msg = this.msg(expect, gotType, name, note);
    if (this.willThrowError) throw TypeError(msg);
    return msg;
  }
});
Object.defineProperty(You, 'are', {
  value: function value(expect, got) {
    try {
      var chk = this.areNot(expect, got);
      if (typeof chk === 'string') return false;
      return true;
    } catch (error) {
      return false;
    }
  }
});
Object.defineProperty(You, 'primitives', {
  value: ['string', 'number', 'nan', // this is an opinion. NaN should not be of type number in the literal sense.
  'array', 'object', 'function', 'boolean', 'null', 'undefined' // no support for symbol. should we care?
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

You.is = function (expect, got) {
  return this.are(expect, got);
};

You.found = function (expect, got, gotType) {
  if (typeof gotType == 'string') gotType = [gotType];
  var found = false;

  for (var i = 0; i < expect.length; i++) {
    var el = expect[i];

    if (el.indexOf('$$') > -1) {
      // the customs must pass or fail as a whole, not in part.
      var passing = this.are(this[el].primitive, got, this.customNameReplace(el));

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
  var _this = this;

  if (typeof expect === 'string') {
    expect = [expect];
  } else if (!Array.isArray(expect)) {
    throw TypeError("Internal error: Say what you expect to check as a string or array of strings. Found ".concat(this.list(this.type(expect), 'as'), "."));
  } //return expect


  return expect.reduce(function (r, expect) {
    if (typeof expect !== 'string') throw TypeError("Internal error: Say what you expect to check as a string. Found ".concat(_this.list(_this.type(expect), 'as'), "."));
    expect = expect.toLowerCase();
    return _this.mapExpect(r, expect);
  }, []);
};

You.mapExpect = function (r, expect) {
  if (this.primitives.indexOf(expect) === -1) {
    if (this["$$custom_".concat(expect)] !== undefined) {
      r.push("$$custom_".concat(expect));
      return r;
    }

    throw TypeError("Internal error: `".concat(expect, "` is not a valid type to check for."));
  }

  r.push(expect);
  return r;
};

You.msg = function (expect, got, name, note) {
  var msg = 'Wrong Type'; // type error, invalid argument, validation error... have been considered. 'Wrong Type' sounds most simple.

  msg += name ? " (".concat(name, ")") : '';
  msg += ": Expecting type ".concat(this.list(expect), " but got ").concat(this.list(got), ".");
  msg += note ? " Note: ".concat(note, ".") : '';
  return msg;
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

  return 'object';
};

You.lodge = function (expect, got, name, note) {
  // when using ingest you want to mute throwing errors.
  this._oldValue_willThrowError = this.willThrowError;
  this.willThrowError = false;
  if (!this._lodged) this._lodged = [];
  var ingestation = this.areNot(expect, got, name, note);
  if (ingestation) this._lodged.push(ingestation); // revert

  this.willThrowError = this._oldValue_willThrowError;
  this._oldValue_willThrowError = null;
  return ingestation;
};

You.resolve = function (callback, returnedPayload) {
  //console.log(this._lodged)
  if (this._lodged === undefined || this._lodged.length === 0) {
    return typeof callback === 'function' ? callback(false, returnedPayload) : false;
  }

  if (typeof callback === 'function') return callback(this._lodged, returnedPayload);

  if (this.willThrowError) {
    var errors = TypeError('Wrong types provided. See `trace`.');
    errors.trace = this._lodged;
    throw errors;
  }

  return this._lodged;
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
    return not.resolve(callback);
  }

  if (_typeof(callback) === 'object') {
    var returnedPayload = null;

    if (callback.returnPayload === true) {
      returnedPayload = not.walkObject(name, expectObject, gotObject, true);
      if (returnedPayload === '$$empty$$') returnedPayload = {};
    }

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

You.walkObject = function (name, expectObject, gotObject, returnPayload) {
  if (returnPayload) var sanitisedPayload = {};

  for (var i = 0, keys = Object.keys(expectObject); i < keys.length; i++) {
    var key = keys[i];
    var expect = expectObject[key];
    var optional = false;

    if (key.indexOf('__optional') > -1) {
      optional = function replace(key) {
        return key.replace('__optional', '');
      };
    } else if (key.indexOf('?') === key.length - 1) {
      optional = function replace(key) {
        return key.substring(0, key.length - 1);
      };
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

    if (optional) expect = Array.isArray(expect) ? expect.push('optional') : [expect, 'optional'];
    var fail = this.lodge(expect, got, "".concat(name, ".").concat(keyCopy));
    if (returnPayload && !fail && got) sanitisedPayload[keyCopy] = got;
  }

  if (returnPayload) return Object.keys(sanitisedPayload).length < 1 ? '$$empty$$' : sanitisedPayload;
};

You.defineType = function (payload) {
  var _this2 = this;

  var sanitised = this.__proto__.checkObject('defineType', {
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
    if (_this2.primitives.indexOf(p) === -1) throw TypeError("Internal error: `".concat(p, "` is not a valid primitive."));
  });
  var key = "$$custom_".concat(sanitised.type);
  this[key] = {
    primitive: sanitised.primitive
  };
  if (sanitised.pass) this[key]['pass'] = sanitised.pass;
};

You.$$custom_optional = {
  primitive: ['null', 'undefined']
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

You._applyOptions = function (instance, options) {
  //using #are because it's not writable and configurable
  if (this.are('object', options)) {
    if (this.are('boolean', options.opinionatedOnNaN)) instance.opinionatedOnNaN = options.opinionatedOnNaN;
    if (this.are('boolean', options.opinionatedOnArray)) instance.opinionatedOnArray = options.opinionatedOnArray;
    if (this.are('boolean', options.opinionatedOnNull)) instance.opinionatedOnNull = options.opinionatedOnNull;
    if (this.are('boolean', options.opinionatedOnString)) instance.opinionatedOnString = options.opinionatedOnString;
    if (this.are('boolean', options.isOpinionated)) instance.isOpinionated = options.isOpinionated;
    if (this.are('boolean', options.willThrowError)) instance.willThrowError = options.willThrowError;
  }
};

module.exports = Object.create(You);
exports = module.exports;

},{}]},{},[1])(1)
});
