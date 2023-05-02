import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type HvDataMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ShareCompMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class HvData {
  readonly id: string;
  readonly html: string;
  readonly author: string;
  readonly title: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<HvData, HvDataMetaData>);
  static copyOf(source: HvData, mutator: (draft: MutableModel<HvData, HvDataMetaData>) => MutableModel<HvData, HvDataMetaData> | void): HvData;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly img: string;
  readonly joinId: string;
  readonly friends: (string | null)[];
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}

export declare class ShareComp {
  readonly id: string;
  readonly html: string;
  readonly author: string;
  readonly name: string;
  readonly descript: string;
  readonly like: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ShareComp, ShareCompMetaData>);
  static copyOf(source: ShareComp, mutator: (draft: MutableModel<ShareComp, ShareCompMetaData>) => MutableModel<ShareComp, ShareCompMetaData> | void): ShareComp;
}