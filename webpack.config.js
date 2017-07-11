const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const bundlesCtx = path.resolve(__dirname, 'bundles');
const bundles = fs.readdirSync(bundlesCtx);
const entry = bundles.reduce((acc, file) => {
  const parts = file.split(/\.js$/);
  acc[parts[0]] = `./${parts[0]}.js`;
  return acc;
}, {});

console.log('Entry points: ', JSON.stringify(entry, null, 2));

const config = {
  entry,
  context: bundlesCtx,
  output: {
    path: path.resolve(__dirname, 'bundles-out'),
    filename: '[name].bundle.js',
    libraryTarget: 'var',
    library: ['formigone', '[name]'],
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }]
          ]
        }
      }]
    }]
  }
};

module.exports = config;
