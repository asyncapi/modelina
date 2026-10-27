export enum Status {
  Xray = 'x',
  Yankee = 'y',
  Numeric = '123'
}

export interface Box<T> {
  value: T;
}

export interface Shipment {
  status: Status;
  kind: 'zulu' | 'alpha' | '42';
  numbers: Box<number>;
  labels: Box<string>;
}
