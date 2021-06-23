import { containsNumber } from './form-helpers';

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

export const MIN_SEALED_VOLUME = 550;

export const priceMatrix =
  process.env.NODE_ENV === 'development'
    ? {
        [Term.Monthly]: {
          [Storage.Raw]: { id: 'price_1J50FiLaNzAt04pey0bvgYK3', price: 0.7 },
          [Storage.Slabbed]: { id: 'price_1J50EGLaNzAt04pe1WWIS6JE', price: 1 },
          [Storage.Sealed]: {
            id: 'price_1J59XmLaNzAt04pejLMrJpys',
            price: 0.005050505051,
          },
        },
        [Term.Yearly]: {
          [Storage.Raw]: { id: 'price_1J50GRLaNzAt04peS9wBCpzV', price: 8.4 },
          [Storage.Slabbed]: {
            id: 'price_1J50GvLaNzAt04peBRAn2CFc',
            price: 12,
          },
          [Storage.Sealed]: {
            id: 'price_1J59ceLaNzAt04pedGHrC09U',
            price: 0.06060606061,
          },
        },
      }
    : {
        [Term.Monthly]: {
          [Storage.Raw]: { id: 'price_1J4vEeLaNzAt04peroSwdckq', price: 0.7 },
          [Storage.Slabbed]: { id: 'price_1J5Go0LaNzAt04pe6UY60G6z', price: 1 },
          [Storage.Sealed]: {
            id: 'price_1J5GpULaNzAt04peIx6NzC3k',
            price: 0.005050505051,
          },
        },
        [Term.Yearly]: {
          [Storage.Raw]: { id: 'price_1J5GmuLaNzAt04peuzokm58V', price: 8.4 },
          [Storage.Slabbed]: {
            id: 'price_1J5GnULaNzAt04pex3Cr60o4',
            price: 12,
          },
          [Storage.Sealed]: {
            id: 'price_1J5GqTLaNzAt04pevYwcLb7X',
            price: 0.06060606061,
          },
        },
      };

export interface Size {
  length: string;
  width: string;
  height: string;
}

export const containsSize = ({ length, width, height }: Size): boolean =>
  containsNumber(length) && containsNumber(width) && containsNumber(height);

export const volumeOfSealed = (size: Size): number => {
  if (containsSize(size)) {
    return (
      parseFloat(size.length) * parseFloat(size.width) * parseFloat(size.height)
    );
  }
  return -1;
};
