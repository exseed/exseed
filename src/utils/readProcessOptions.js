import path from 'path';

export default function readProcessOptions() {
  const rawProcessOptions = process.env.EXSEED_OPTIONS;
  return (rawProcessOptions === undefined)? {}: JSON.parse(rawProcessOptions);
}