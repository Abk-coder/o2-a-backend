import { Config, Production, Development } from './config.interface';
import * as _ from 'lodash';
import * as path from 'path';

const projectRootPath = path.join(__dirname, '../../../');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(projectRootPath, '.env') });

export const configuration = async (): Promise<Config> => {
  const { config } = await import(`./envs/env.${process.env.NODE_ENV}`);
  const { config: env } = await (<{ config: Development }>(
    await import(`./envs/env.${process.env.NODE_ENV}`)
  ));
  return _.merge(config, env);
};
