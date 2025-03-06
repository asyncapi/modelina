export interface InnerData {
  age: number;
  name: string;
  free: boolean;
}

export interface OuterData {
  inner: InnerData;
  name: string;
}
