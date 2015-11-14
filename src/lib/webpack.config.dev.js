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
    [require('babel-plugin-react-transform'), {
      transforms: [
        {
          transform: 'react-transform-hmr',
          imports: ['react'],
          locals: ['module'],
        }, {
          transform: 'react-transform-catch-errors',
          imports: ['react', 'redbox-react'],
        },
      ],
    },],
  ],

  // plugins: [
  //   ['transform-object-rest-spread'],
  //   ['transform-class-properties'],
  //   [require('babel-plugin-react-transform'), {
  //     transforms: [
  //       {
  //         transform: 'react-transform-hmr',
  //         imports: ['react'],
  //         locals: ['module'],
  //       }, {
  //         transform: 'react-transform-catch-errors',
  //         imports: ['react', 'redbox-react'],
  //       },
  //     ],
  //   },],
  // ],
};

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
  ],
  output: {
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel?' + JSON.stringify(babelSettings)],
    },],
  },
};