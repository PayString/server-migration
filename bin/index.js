#!/usr/bin/env node

const yargs = require('yargs')
const fs = require('fs')
const {
  getAndPutWithTransform,
  xAddressToClassic,
} = require('../build/src/index')

const options = yargs
  .usage('Usage: -b <baseUrl> -f <file> -a <adminApiVersion>')
  .options({
    f: {
      alias: 'file',
      describe: 'Text file with PayIDs',
      type: 'string',
      demandOption: true,
      nargs: 1,
    },
    b: {
      alias: 'baseUrl',
      describe: 'The base URL of the PayID Server Admin API endpoint',
      type: 'string',
      default: 'http://127.0.0.1:8081',
      demandOption: true,
      nargs: 1,
    },
    a: {
      alias: 'adminApiVersion',
      describe: 'The Admin API version of the PayID Server',
      type: 'string',
      default: '2020-08-01',
      demandOption: true,
      nargs: 1,
    },
    t: {
      alias: 'transformFunction',
      describe: 'The transform function to apply to the user payload',
      type: 'string',
      choices: ['xAddressToClassic'],
      demandOption: true,
      nargs: 1,
    },
  }).argv

// Read PayIDs from text file into array
// eslint-disable-next-line node/no-sync -- Does not need to be async.
const text = fs.readFileSync(options.file, 'utf-8')
const payIds = text.split('\n').slice(0, -1)

// Map of transforms
const tranforms = {
  xAddressToClassic,
}

// Do the find & replace
void getAndPutWithTransform(
  options.baseUrl,
  payIds,
  options.adminApiVersion,
  tranforms[options.tranformFunction],
)
