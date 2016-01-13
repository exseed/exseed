import path from 'path';
import { FORMAT_OPTION_FILE_NAME } from '../constants';

export default function readOptions() {
  const entryFilePath = process.argv[1];
  const parsed = path.parse(entryFilePath);
  const opts = require(path.join(parsed.dir, FORMAT_OPTION_FILE_NAME));
  return opts;
}