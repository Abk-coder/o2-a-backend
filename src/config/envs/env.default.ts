import * as path from 'path';

const projectRootPath = path.join(__dirname, '../../../../');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(projectRootPath, '.env') });
export const config = {
  port: process.env.PORT,
  jwtAlgorithm: process.env.ALG,
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY,
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jolrw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  },
  env: process.env.NODE_ENV,
  root: path.normalize(`${__dirname}/../..`),
};
