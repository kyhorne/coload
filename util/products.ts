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

export enum Storage {
  Raw = 'Raw',
  Slabbed = 'Slabbed',
  Sealed = 'Sealed',
}

export const MIN_SEALED_VOLUME = 1000;

export const priceMatrix =
  process.env.NODE_ENV === 'development'
    ? {
        [Term.Monthly]: {
          [Storage.Raw]: { id: 'price_1J50FiLaNzAt04pey0bvgYK3', price: 0.7 },
          [Storage.Slabbed]: { id: 'price_1J50EGLaNzAt04pe1WWIS6JE', price: 1 },
          [Storage.Sealed]: { id: 'price_1J59XmLaNzAt04pejLMrJpys', price: 0 },
        },
        [Term.Yearly]: {
          [Storage.Raw]: { id: 'price_1J50GRLaNzAt04peS9wBCpzV', price: 8.4 },
          [Storage.Slabbed]: {
            id: 'price_1J50GvLaNzAt04peBRAn2CFc',
            price: 12,
          },
          [Storage.Sealed]: { id: 'price_1J59ceLaNzAt04pedGHrC09U', price: 0 },
        },
      }
    : {
        [Term.Monthly]: {
          [Storage.Raw]: { id: 'price_1J4vEeLaNzAt04peroSwdckq', price: 0.7 },
          [Storage.Slabbed]: { id: 'price_1J5Go0LaNzAt04pe6UY60G6z', price: 1 },
          [Storage.Sealed]: { id: 'price_1J5GpULaNzAt04peIx6NzC3k', price: 0 },
        },
        [Term.Yearly]: {
          [Storage.Raw]: { id: 'price_1J5GmuLaNzAt04peuzokm58V', price: 8.4 },
          [Storage.Slabbed]: {
            id: 'price_1J5GnULaNzAt04pex3Cr60o4',
            price: 12,
          },
          [Storage.Sealed]: { id: 'price_1J5GqTLaNzAt04pevYwcLb7X', price: 0 },
        },
      };

export interface Size {
  length: string;
  width: string;
  height: string;
}

export const valueOfSize = (size: Size): [number, number, number] => {
  const length = parseFloat(size.length);
  const width = parseFloat(size.width);
  const height = parseFloat(size.height);
  return [length, width, height];
};

export const volumeOfSealed = (size: Size): number => {
  const [length, width, height] = valueOfSize(size);
  if (!isNaN(length) && !isNaN(width) && !isNaN(height)) {
    return length * width * height;
  }
  return 0;
};
