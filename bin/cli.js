#!/usr/bin/env node

const path = require('path');
const fsp = require('fs-promise');
const _ = require('lodash');
const lightflow = require('lightflow');
const chalk = require('chalk');
const meow = require('meow');
const webpackConfig = require('./webpack.config');
const server = require('./server');
const {validate} = require('./helpers');
const cwd = process.cwd();

const cli = meow(`
  Usage
    $ dp <directory>

  Commands
    ...

  Options
    -h --html   ...
    -c --css    ...
    -j --js     ...
    -w --watch  ...

  Examples
    dp demo -h src/*.html -c src/*.css -j src/*.js
`, {
  alias: {
    h: 'html',
    c: 'css',
    j: 'js',
    w: 'watch'
  }
});

const data = {
  src: cli.input[0],
  dest: cli.input[1],
  html: cli.flags.h,
  css: cli.flags.c,
  js: cli.flags.j
}

try {
  validate(data);
} catch (err) {
  console.log(err);
}


// dp src dest

flow().start(data);

function flow(opts) {
  return lightflow()
           .then(({next, error, data}) => {
             Promise.all([data.html, data.css, data.js].map(p => {
               try {
                 return fsp.readFile(p, 'utf-8');
               } catch (err) {
                 error(err);
               }
             })).then(contents => {
               next(contents);
             })
           })
           .then(({next, error, data}) => {
             const demoContents = {
               html: data[0],
               css: data[1],
               js: data[2]
             };
             next(JSON.stringify(demoContents))
           })
           .done(demoContents => {
             const webpack = require('webpack');
             const tmp = require('tmp');

             tmp.file((err, tmpFilePath, fd, cleanupCallback) => {
               if (err) {
                 throw err;
               }

               const tmpFileDir = path.dirname(tmpFilePath)

               console.log(tmpFileDir);
               console.log(cleanupCallback);

               const config = webpackConfig.make(cwd, demoContents, tmpFileDir);
               server.serve(cwd, config, tmpFileDir).emitter.on('init', () => {
                  //  webpack(config).run((err, stats) => {
                  //   //  console.log(stats);
                  //  });
               });
               cleanupCallback();
             });
           })
           .catch(err => {
             console.log(`Error: ${err}`);
           })

}
