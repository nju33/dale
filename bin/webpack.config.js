const path = require('path');
const webpack = require('webpack');

const APP_DIR = 'app';

module.exports = {
  make(cwd, demoContents, outputPath) {
    return {
      devtool: '#eval-source-map',
      context: path.join(__dirname, '..'),

      resolve: {
        modules: [
          path.join(__dirname, '../node_modules/'),
          path.resolve(__dirname, '../app/'),
          'node_modules/'
        ],
        extensions: ['.jsx', '.js', '.json'],
      },

      entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        path.resolve(__dirname, '../app/main.jsx')
      ],

      output: {
        path: outputPath,
        publicPath: '/scripts/',
        filename: 'index.js'
      },

      plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          demoContents
        })
      ],

      module: {
        loaders: [
          {
            test: /\.jsx$/,
            exclude: /node_modules/,
            loaders: [
              // 'react-hot',
              {
                loader: 'babel',
                query: {
                  presets:  ['es2015', 'react'],
                  plugins:[
                    'react-hot-loader/babel',
                    'transform-object-rest-spread',
                    'transform-decorators-legacy'
                  ]
                }
              }
            ]
          }
        ]
      }

      // module: {
      //   loaders: [
      //     {
      //       test: /\.jsx?$/,
      //       exclude: /node_modules/,
      //       loaders: [
      //         // 'react-hot-loader',
      //         {
      //           loader: 'babel-loader',
      //           query: {
      //             presets:  ['es2015', 'react'],
      //             plugins:[
      //               'transform-object-rest-spread',
      //               'transform-decorators-legacy'
      //             ]
      //           }
      //         }
      //       ]
      //     }
        // ]
      // }
    }
  }
};
