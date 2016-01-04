var webpack = require('webpack');
var babelSettings = require('./defaultBabelSettings');

module.exports = {
  devtool: 'eval',
  entry: {},
  output: {
    filename: '[name]/public/js/bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(true),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['babel?' + JSON.stringify(babelSettings)],
    },],
  },
};