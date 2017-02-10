module.exports = {
  extends: 'google',
  env: {
    node: true,
    es6: true
  },
  rules: {
    'no-unused-vars': [2, {'args': 'after-used', 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_'}],
    'require-jsdoc': 0
  },
  parserOptions: {
    sourceType: 'module'
  }
};
