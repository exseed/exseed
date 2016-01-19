import path from 'path';
import {
  FORMAT_OPTION_FILE_NAME,
  DEFAULT_OPTION
} from '../constants';

export default function readOptions() {
  const entryFilePath = process.argv[1];
  const parsed = path.parse(entryFilePath);
  let opts;
  try {
    opts = require(path.join(parsed.dir, FORMAT_OPTION_FILE_NAME));
  } catch (e) {
    // if option file not found, return default value
    opts = DEFAULT_OPTION;
  }
  return opts;
}