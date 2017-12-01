/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare type Dictionary<T> = {
  [index: string]: T;
}

declare type IIndex = {
  [index: string]: any
}

declare type ObjectValues<T extends object> = {
  [p in keyof T]?: T[p]
}

declare type NameValue = {
  name: string,
  value: any
}