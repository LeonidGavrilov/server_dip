import keysDev from './keys.dev';
import keysProd from './keys.prod';

interface IKeys {
  connectionDB: string | undefined;
  sessionSecret: string | undefined;
  sendGridKey: string | undefined;
  emailFrom: string | undefined;
  baseUrl: string | undefined;
}

let keys: IKeys;
if (process.env.NODE_ENV === "production") {
  keys = keysProd;
} else {
  keys = keysDev;
}

export default keys;