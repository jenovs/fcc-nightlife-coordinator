const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    // fetch polyfill to support iOS
    'whatwg-fetch',
    path.join(__dirname, 'src', 'app.js')
  ],

  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },

  plugins: [
    new webpack.ProvidePlugin({
      // fetch polyfill to support iOS
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    })
  ]
};
