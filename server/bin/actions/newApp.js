#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const copy = require('copy');
const program = require('commander');
const spawn = require('child_process').spawn;
const logger = require('../utils/logger');

const promisifiedExists = util.promisify(fs.exists);
const promisifiedMkdir = util.promisify(fs.mkdir);
const promisifiedCopy = util.promisify(copy);

module.exports = async (appName, cmd) => {
  try {
    const sourceFolderPath = `${__dirname}/../../templates/app`;
    const targetFolderPath = `${process.cwd()}/${appName}`;

    const exists = await promisifiedExists(targetFolderPath);

    if (exists) {
      logger.error(`App ${appName} already exists!`);
      return;
    }

    logger.info(`Creating ${appName} folder...`);
    await promisifiedMkdir(targetFolderPath);
    await promisifiedCopy(`${sourceFolderPath}/{*,.*,!(node_modules)/**/*}`, targetFolderPath);
    // TODO: Update package.json attributes accordingly
    logger.success('Created!');

    process.chdir(targetFolderPath);

    logger.info('Installing dependencies...');
    spawn('npm', ['i']).on('exit', (code) => logger.success('Done!'));
  } catch (e) {
    logger.error(e);
  }
}
