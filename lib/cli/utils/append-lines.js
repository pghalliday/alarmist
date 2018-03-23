'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = appendLines;
function appendLines(maxLinesLength, maxLineLength, lines, data) {
  var extraLines = data.toString('utf8').split('\n').map(function (line) {
    return line.slice(0, maxLineLength);
  });
  var newLines = lines.slice(0);
  newLines.push((newLines.pop() + extraLines.shift()).slice(0, maxLineLength));
  return newLines.concat(extraLines).slice(-maxLinesLength);
}