import path from 'path';

export default function requireRawModule(...filePath) {
  const requirePath = path.join(...filePath);
  try {
    // if module exists
    const required = require(requirePath);
    return required;
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e;
    }
    // if module does not exist
    return undefined;
  }
};