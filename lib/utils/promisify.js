"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (f) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve, reject) {
      f.apply(undefined, args.concat([function (error) {
        for (var _len2 = arguments.length, results = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          results[_key2 - 1] = arguments[_key2];
        }

        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }]));
    });
  };
};