'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _actions = require('../redux/actions');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Run = function () {
  function Run(_ref) {
    var store = _ref.store,
        status = _ref.status;

    _classCallCheck(this, Run);

    this.store = store;
    store.dispatch((0, _actions.runStart)(status));
  }

  _createClass(Run, [{
    key: 'end',
    value: function end(status) {
      store.dispatch((0, _actions.runEnd)(status));
    }
  }]);

  return Run;
}();

exports.default = Run;