const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src', 'app.js'),

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
  }
};
