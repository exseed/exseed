import path from 'path';
import requireRawModule from './requireRawModule';

export default function requireModule(...filePath) {
  const required = requireRawModule(...filePath);
  return (required? (required.default || required): undefined);
};