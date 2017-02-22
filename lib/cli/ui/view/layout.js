"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLayout = createLayout;
function createLayout(screen) {
  var elements = [];
  return {
    append: function append(element) {
      elements.push(element);
      screen.append(element);
    },
    apply: function apply() {
      var top = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var element = _step.value;

          element.top = top;
          top += element.height;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  };
}