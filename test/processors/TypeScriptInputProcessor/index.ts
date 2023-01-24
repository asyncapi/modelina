export type Shape = {
  size: number;
};

export interface InnerData {
  age: number;
  name: string;
  free: boolean;
}

export interface ShapesData {
  data: InnerData;
  sizes: boolean[];
  emails: string[];
}
