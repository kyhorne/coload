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

export const priceMatrix = {
  [Term.Monthly]: {
    [Storage.Raw]: 0.7,
    [Storage.Slabbed]: 1.1,
    [Storage.Sealed]: 0.01666666667,
  },
  [Term.Yearly]: {
    [Storage.Raw]: 7.2,
    [Storage.Slabbed]: 12,
    [Storage.Sealed]: 0.06060606061,
  },
};

export const stripePriceMatrix =
  process.env.NODE_ENV === 'development'
    ? {
        [Term.Monthly]: {
          [Storage.Raw]: 'price_1J50FiLaNzAt04pey0bvgYK3',
          [Storage.Slabbed]: 'price_1J50EGLaNzAt04pe1WWIS6JE',
          [Storage.Sealed]: 'price_1J59XmLaNzAt04pejLMrJpys',
        },
        [Term.Yearly]: {
          [Storage.Raw]: 'price_1J50GRLaNzAt04peS9wBCpzV',
          [Storage.Slabbed]: 'price_1J50GvLaNzAt04peBRAn2CFc',
          [Storage.Sealed]: 'price_1J59ceLaNzAt04pedGHrC09U',
        },
      }
    : {
        [Term.Monthly]: {
          [Storage.Raw]: 'price_1J4vEeLaNzAt04peroSwdckq',
          [Storage.Slabbed]: 'price_1J5Go0LaNzAt04pe6UY60G6z',
          [Storage.Sealed]: 'price_1J5GpULaNzAt04peIx6NzC3k',
        },
        [Term.Yearly]: {
          [Storage.Raw]: 'price_1J5GmuLaNzAt04peuzokm58V',
          [Storage.Slabbed]: 'price_1J5GnULaNzAt04pex3Cr60o4',
          [Storage.Sealed]: 'price_1J5GqTLaNzAt04pevYwcLb7X',
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
