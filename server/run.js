require('babel-polyfill');
require('ignore-styles');
require('babel-register')({
  ignore:[/(node_modules)/],
  presets: ['env'],
  plugins: [
    'syntax-dynamic-import',
    'dynamic-import-node',
    'transform-react-jsx',
  ],
});
require('./graphql-server');