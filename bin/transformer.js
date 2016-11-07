const path = require('path');

exports.transformPostcss = function (content) {
  const postcss = require('postcss');
  return content;
}

exports.transformWebpack = function (content, filePath, config) {
  const webpack = require('webpack');
  const dirname = path.dirname(filePath);
  const cwd = process.cwd();

    const compiler = webpack({
    devtool: '#eval-source-map',
    context: path.join(__dirname, '..'),

    resolve: {
      modules: [
        path.join(__dirname, '../node_modules/'),
        path.resolve(__dirname, '../app/'),
        'node_modules/',

      ],
      extensions: ['.jsx', '.js', '.json'],
    },

    entry: [
      path.resolve(cwd, 'demo', config.entry)
    ],

    output: {
      path: path.join(cwd, 'app'),
      filename: config.entry.replace(/\..*$/, '.js')
    },

    plugins: [
      // new webpack.optimize.OccurrenceOrderPlugin(),
      // new webpack.HotModuleReplacementPlugin(),
      // new webpack.NoErrorsPlugin(),
      // new webpack.DefinePlugin({
      //   demoContents: JSON.stringify(demoContents),
      //   srcContents: JSON.stringify(srcContents)
      // })
    ],

    module: {
      loaders: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loaders: [
            {
              loader: 'babel',
              query: {
                presets:  ['es2015', 'react', 'stage-1'],
                plugins:[
                  // 'react-hot-loader/babel',
                  'transform-object-rest-spread',
                  'transform-decorators-legacy'
                ]
              }
            }
          ]
        }
      ]
    }
  }).run(() => {});
  // const result = babel.transform(content, {
  //   moduleRoot: '/Users/nju33/npm/dp',
  //   presets:  ['es2015', 'react', 'stage-1'],
  //   plugins:[
  //     'transform-object-rest-spread',
  //     'transform-decorators-legacy'
  //   ]
  // });
  // return result.code;
}
