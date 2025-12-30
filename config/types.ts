export type Mode = "development" | "production";

export interface IPaths {
  entry: string;
  output: string;
  src: string;
}

export interface IOptions {
  mode: Mode;
  analyzer?: boolean;
}

export interface IClient extends IOptions {
  port: number;
  pathClient: IPaths;
}

export interface IServer extends IOptions {
  port: number;
  pathServer: IPaths;
}
