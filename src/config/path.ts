import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');
const certs = join(root, './certs');
const keys = join(root, './keys');

export const Path = {
  root,
  certs,
  keys,
};
