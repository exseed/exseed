import path from 'path';

export default function readOptions() {
  const entryFilePath = process.argv[1];
  const parsed = path.parse(entryFilePath);
  const opts = require(path.join(parsed.dir, 'exseed.opts.json'));
  return opts;
}