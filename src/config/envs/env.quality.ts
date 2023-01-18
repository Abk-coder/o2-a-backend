import * as path from 'path';

const projectRootPath = path.join(__dirname, '../../../../');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(projectRootPath, '.env') });

export const config = {
  port: process.env.PORT,
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY,
  jwtAlgorithm: process.env.ALG,
  db: {
    uri: process.env.MONGODB_URL,
    auth: {
      authSource: process.env.MONGO_AUTH,
    },
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
  },

};
