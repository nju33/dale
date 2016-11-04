const path = require('path');
const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const server = browserSync.create();

module.exports = {
  serve(cwd, webpackConfig, jsDir) {
    const compiler = webpack(webpackConfig);
    server.init({
      server: {
        baseDir: path.join(__dirname, '../app/'),
        routes: {
          '/scripts': path.join(jsDir)
        },
        middleware: [
          webpackDevMiddleware(compiler, {
            publicPath: webpackConfig.output.publicPath,
            stats: {colors: true}
          }),
          webpackHotMiddleware(compiler)
        ]
      },
      files: [
        path.join(cwd, 'app/styles/**/*.css'),
        path.join(cwd, 'app/*.html')
      ]
    });
    return server;
  }
};
