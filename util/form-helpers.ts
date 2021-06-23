import { Size } from './products';

export const isWholeNumber = (input: string): boolean => /^-?\d+$/.test(input);

export const isNumber = (input: string): boolean => /^-?\d*\.?\d*$/.test(input);

export const containsNumber = (input: string): boolean =>
  input !== '' && isWholeNumber(input);
