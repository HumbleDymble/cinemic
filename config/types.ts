export type Mode = "development" | "production";

export interface IPaths {
  entry: string;
  output: string;
}

export interface IPathsClient extends IPaths {
  src: string;
}

export interface IOptions {
  mode: Mode;
  analyzer?: boolean;
}

export interface IClient extends IOptions {
  port: number;
  pathClient: IPathsClient;  
}

export interface IServer extends IOptions {
  pathServer: IPaths;
}
