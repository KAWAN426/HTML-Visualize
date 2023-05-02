export interface ICompData {
  id: number;
  name: string;
  descript: string;
  comp: string;
  tag: string;
}

export type TAbleStyle = {
  [key: string]: "value" | "detail" | "color" | string[];
}

export interface IHvData {
  id: string;
  html: string;
  author: string;
  title: string;
  updatedAt: string;
}

export interface IUser {
  img: string;
  name: string;
  id: string;
  joinId: string;
  friends?: [string] | [];
}

export interface IShareComp {
  id: string;
  html: string;
  author: string;
  name: string;
  descript: string;
  like: string;
  createdAt: string;
  updatedAt: string;
}