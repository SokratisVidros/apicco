#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const copy = require('copy');
const program = require('commander');
const spawn = require('child_process').spawn;
const newApp = require('./actions/newApp');

program
  .command('new <app-name>')
  .alias('n')
  .description('Create a new Apiko API')
  .action(newApp);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
