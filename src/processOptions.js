import { readProcessOptions } from './utils/';

let pOpts;
if (!pOpts) {
  pOpts = readProcessOptions();
}

export default pOpts;