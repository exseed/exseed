import path from 'path';

export default function requireModule(...filePath) {
  const requirePath = path.join(...filePath);
  try {
    // if module exists
    const required = require(requirePath);
    return required.default || required;
  } catch (e) {
    // if module does not exist
    return undefined;
  }
};