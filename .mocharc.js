module.exports = {
  spec: 'test/src',
  recursive: true,
  require: [
    'babel-polyfill',
    'test/helpers/common'
  ]
};
