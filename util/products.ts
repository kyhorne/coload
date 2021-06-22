export interface Product {
  quantity: number;
  price: string;
}

export interface PostProduct {
  items: Product[];
}

export enum Term {
  Monthly = 'Monthly',
  Anuallly = 'Annually',
}

export enum StorageType {
  Raw = 'Raw',
  Slabbed = 'Slabbed',
  Sealed = 'Sealed',
}
