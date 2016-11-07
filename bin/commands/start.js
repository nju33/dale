const path = require('path');
const fsp = require('fs-promise');
const globp = require('glob-promise');
const mkdirp = require('mkdirp');
const co = require('co');
const _ = require('lodash');
const lightflow = require('lightflow');
const webpack = require('webpack');
const tmp = require('tmp');

const webpackConfig = require('../webpack.config');
const {transformPostcss, transformWebpack} = require('../transformer');
const server = require('../server');

const srcDefault = {
  base: '',
  defaultPattern: null,
  pattern: null
};

'use strict';
module.exports = ({demo, src}, opts) => {
  const cwd = process.cwd();

  for (const extName in src) {
    const conf = src[extName] = Object.assign({}, srcDefault, src[extName]);
    if (conf.pattern === null) {
      throw new Error(`config.src[${extName}].pattern was required`);
    }
  }

  transformSrc(cwd, src, opts)
  .then(() => co(function* () {
    const demoContents = {html: '', css: [], js: []};
    for (const extName in demo) {
      const target = demo[extName];
      if (Array.isArray(target)) {
        for (const item of target) {
          if (/^http/.test(item)) {
            demoContents[extName].push(item);
          } else {
            const filePath = path.join(cwd, item);
            const content = yield fsp.readFile(filePath, 'utf-8');
            demoContents[extName].push(content);
          }
        }
      } else {
        const filePath = path.join(cwd, target);
        const content = yield fsp.readFile(filePath, 'utf-8');
        demoContents[extName] = content;
      }
    }

    const srcContents = {};
    for (const extName in src) {
      const {base, defaultPattern, pattern} = src[extName];
      const filePaths = yield getFilePaths(cwd, opts.srcDir, pattern);
      const contents = yield readContents(cwd, base, defaultPattern,
                                            opts.srcDir, filePaths);
      srcContents[extName] = contents;
    }

    return {demoContents, srcContents};
  }))
  .then(
    data => {
      tmp.file((err, tmpFilePath, fd, cleanupCallback) => {
        if (err) {
          throw err;
        }

        const tmpFileDir = path.dirname(tmpFilePath);
        const config = webpackConfig.make(cwd, data, tmpFileDir);
        server.serve(cwd, config, tmpFileDir).emitter.on('init', () => {
        //  webpack(config).run((err, stats) => {
        //   //  console.log(stats);
        //  });
        });
        cleanupCallback();
      });
    },
    err => {
      console.log(err);
    }
  )
};

function getFilePaths(cwd, srcDir, pattern) {
  return co(function* () {
    const filePaths = yield globp(path.join(cwd, srcDir, pattern));
    return filePaths;
  });
}

function readContents(cwd, base, defaultPattern, srcDir, filePaths) {
  return co(function* () {
    const contents = {};
    yield Promise.all(filePaths.map(filePath => {
      const relative = abs2rel(cwd, srcDir, filePath);
      const treePath = resolvePath(base, relative);
      return co(function* () {
        const content = yield fsp.readFile(filePath, 'utf-8');
        contents[treePath] = content;

        try {
          if (defaultPattern !== null &&
              defaultPattern.test(treePath)) {
            contents['_default'] = {treePath, content};
          }
        } catch (err) {
          console.log(err);
        }
        return;
      });
    }));

    if (!contents['_default']) {
      contents['_default'] = (() => {
        const treePath = Object.keys(contents)[0];
        const content = contents[treePath];
        return {treePath, content};
      })();
    }
    return contents;
  });
}


function abs2rel(cwd, srcDir, filePath) {
  const replaced = filePath.replace(`${cwd}/${srcDir}`, '');
  return replaced.startsWith('/') ?
           replaced.slice(1) :
           replaced;
}

function resolvePath(base, relative) {
  const replaced = relative.replace(base, '');
  return replaced.startsWith('/') ?
           replaced.slice(1) :
           replaced;
}

function transformSrc(cwd, src, opts) {
  return co(function* () {
    for (const extName in src) {
      const {base, defaultPattern, pattern} = config = src[extName];
      const filePaths = yield getFilePaths(cwd, opts.srcDir, pattern);
      const contents = yield readContents(cwd, base, defaultPattern, opts.srcDir, filePaths);
      for (const filePath in _.omit(contents, '_default')) {
        const transformed = transform(extName, config,
                                        filePath, contents[filePath]);
        const destPath = path.join(cwd, opts.dest, filePath);
        yield co(function* () {
          yield fsp.access(destPath, fsp.constants.F_OK);
        })
        .then(
          () => {
            return co(function* () {
              yield fsp.writeFile(destPath, transformed);
              return;
            });
          },
          () => {
            return co(function* () {
              yield new Promise((resolve, reject) => {
                mkdirp(path.dirname(destPath), err => {
                  if (err) {
                    reject(err);
                  }
                  resolve();
                });
              });
              yield fsp.writeFile(destPath, transformed);
              return;
            });
          }
        )
      }
    }
  });
}

function transform(extName, config, filePath, content) {
  try {
    switch (extName) {
      case 'html': {
        return content;
        break;
      }

      case 'css': {
        return transformPostcss(content);
        break;
      }

      case 'js': {
        if (!/index/.test(filePath)) {
          return;
        }
        return transformWebpack(content, filePath, config);
        break;
      }
    }
  } catch (err) {
    console.log(err);
  }
}
