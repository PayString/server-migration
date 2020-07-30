#!/usr/bin/env node

const yargs = require('yargs')
const fs = require('fs')
const {
  getAndPutWithTransform,
  transformXAddressToClassic,
} = require('../build/src/index')

const options = yargs.usage('Usage: -f <file>').option('f', {
  alias: 'file',
  describe: 'Text file with PayIDs',
  type: 'string',
  demandOption: true,
}).argv

// eslint-disable-next-line node/no-sync -- Does not need to be async.
// const text = fs.readFileSync('./build/test/test.txt', 'utf-8')
const text = fs.readFileSync(options.file, 'utf-8')
const payIds = text.split('\n').slice(0, -1)

void getAndPutWithTransform(
  'http://127.0.0.1:8081',
  payIds,
  '2020-08-01',
  transformXAddressToClassic,
)
