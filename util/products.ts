export interface Product {
  quantity: number;
  price: string;
}

export interface Cart {
  items: Product[];
}

export enum Term {
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

export enum StorageType {
  Raw = 'Raw',
  Slabbed = 'Slabbed',
  Sealed = 'Sealed',
}

export const priceMatrix =
  process.env.NODE_ENV === 'development'
    ? {
        [Term.Monthly]: {
          [StorageType.Raw]: 'price_1J50FiLaNzAt04pey0bvgYK3',
          [StorageType.Slabbed]: 'price_1J50EGLaNzAt04pe1WWIS6JE',
          [StorageType.Sealed]: 'price_1J59XmLaNzAt04pejLMrJpys',
        },
        [Term.Yearly]: {
          [StorageType.Raw]: 'price_1J50GRLaNzAt04peS9wBCpzV',
          [StorageType.Slabbed]: 'price_1J50GvLaNzAt04peBRAn2CFc',
          [StorageType.Sealed]: 'price_1J59ceLaNzAt04pedGHrC09U',
        },
      }
    : {
        [Term.Monthly]: {
          [StorageType.Raw]: 'price_1J4vEeLaNzAt04peroSwdckq',
          [StorageType.Slabbed]: 'price_1J5Go0LaNzAt04pe6UY60G6z',
          [StorageType.Sealed]: 'price_1J5GpULaNzAt04peIx6NzC3k',
        },
        [Term.Yearly]: {
          [StorageType.Raw]: 'price_1J5GmuLaNzAt04peuzokm58V',
          [StorageType.Slabbed]: 'price_1J5GnULaNzAt04pex3Cr60o4',
          [StorageType.Sealed]: 'price_1J5GqTLaNzAt04pevYwcLb7X',
        },
      };
