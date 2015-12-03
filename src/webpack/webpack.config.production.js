var webpack = require('webpack');

var babelSettings = {
  cacheDirectory: true,
  presets: [
    'es2015',
    'stage-0',
    'stage-1',
    'react',
  ],
};

module.exports = {
  devtool: 'source-map',
  entry: {},
  output: {
    filename: '[name]/public/js/bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BROWSER: JSON.stringify(true),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ['babel?' + JSON.stringify(babelSettings)],
    },],
  },
};