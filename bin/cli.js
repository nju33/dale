const fsp = require('fs-promise');
const lightflow = require('lightflow');
const chalk = require('chalk');
const meow = require('meow');
const {validate} = require('./helpers');

const cli = meow(`
  Usage
    $ dp <directory>

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
  directory: cli.input[0],
  html: cli.flags.h,
  css: cli.flags.c,
  js: cli.flags.j
}

try {
  validate(data);
} catch (err) {
  console.log(err);
}

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
               next({contents});
             })
           })
           .done(data => {
             console.log(data);
           })
           .catch(err => {
             console.log(`Error: ${err}`);
           })

}
