var webpack = require('webpack');

var babelSettings = {
  cacheDirectory: true,
  presets: [
    'es2015',
    'stage-0',
    'stage-1',
    'react',
  ],
  plugins: [
    ['react-transform', {
      transforms: [{
        transform: 'react-transform-hmr',
        imports: ['react'],
        locals: ['module'],
      }, {
        transform: "react-transform-catch-errors",
        imports: ["react", "redbox-react"],
      },],
    },],
  ],
};

module.exports = {
  devtool: 'eval',
  entry: {},
  output: {
    // this config is not for output scripts into file system
    // and the `filename` here is actually the routing path
    filename: '[name]/js/bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(false),
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