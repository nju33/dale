#!/usr/bin/env node

const path = require('path');
const fsp = require('fs-promise');
const _ = require('lodash');
const glob = require('glob');
const lightflow = require('lightflow');
const chalk = require('chalk');
const meow = require('meow');
const webpackConfig = require('./webpack.config');
const server = require('./server');
const {validate} = require('./helpers');
const cwd = process.cwd();

const cli = meow(`
  Usage
    $ dple <command> <arg> [--option]

  Commands
    start
    build

  Options
    -h --html   ...
    -c --css    ...
    -j --js     ...
    -w --watch  ...

  Examples
    dple new <src dir>
`, {
  alias: {
    d: 'dest',
    h: 'html',
    c: 'css',
    j: 'js',
    w: 'watch'
  }
});

const data = {
  command: cli.input[0],
  arg: cli.input[1],
  dest: cli.flags.d
}

let config = null;
try {
  validate(data);
  config = require(path.join(process.cwd(), 'dp.config'));
} catch (err) {
  console.log(err);
}

if (cli.flags.help) {
  console.log(cli.help);
  process.exit(0);
}

switch (data.command) {
  case 'start': {
    require('./commands/start')(config, {
      srcDir: data.arg,
      dest: data.dest
    });
    break;
  }

  case 'build': {
    require('./commands/build')();
    break;
  }

  default: {
    console.log(cli.helpc);
  }
}
