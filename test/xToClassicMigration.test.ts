import * as fs from 'fs'

import {
  getAndPutWithTransform,
  transformXAddressToClassic,
} from '../src/index'

// eslint-disable-next-line node/no-sync -- Does not need to be async.
const text = fs.readFileSync('./build/test/test.txt', 'utf-8')
const payIds = text.split('\n').slice(0, -1)

void getAndPutWithTransform(
  'http://127.0.0.1:8081',
  payIds,
  '2020-08-01',
  transformXAddressToClassic,
)
