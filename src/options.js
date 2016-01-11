import { readOptions } from './utils/';

let opts;
if (!opts) {
  opts = readOptions();
}

export default opts;