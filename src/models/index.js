// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { HvData, User, ShareComp } = initSchema(schema);

export {
  HvData,
  User,
  ShareComp
};