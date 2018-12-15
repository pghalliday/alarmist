"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(f) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      f(...args, (error, ...results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  };
}