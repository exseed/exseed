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
  entry: {},
  output: {
    filename: 'js/[name]/bundle.js',
    publicPath: '/',
  },
  plugins: [
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