const presets = [
  [
    '@babel/env',
    {
      targets: {
        node: true,
      },
    },
  ],
];

const env = {
  test: {
    plugins: ['istanbul'],
  },
};

module.exports = {presets, env};
