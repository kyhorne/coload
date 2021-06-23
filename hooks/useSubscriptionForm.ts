import React, { useEffect, useRef, useState } from 'react';
import isEqual from 'lodash.isequal';
import {
  Cart,
  MIN_SEALED_VOLUME,
  priceMatrix,
  Size,
  Storage,
  Term,
  volumeOfSealed,
} from '../util/products';
import { containsNumber, isNumber, isWholeNumber } from '../util/form-helpers';

interface FormState extends Size {
  term: Term;
  [Storage.Raw]: string;
  [Storage.Slabbed]: string;
  hasSealed: boolean;
}

interface FormError extends Size {
  [Storage.Raw]: string;
  [Storage.Slabbed]: string;
  volume: string;
}

interface TouchedInput {
  [Storage.Raw]: boolean;
  [Storage.Slabbed]: boolean;
  length: boolean;
  width: boolean;
  height: boolean;
}

const blankFormError = (): FormError => ({
  [Storage.Raw]: '',
  [Storage.Slabbed]: '',
  length: '',
  width: '',
  height: '',
  volume: '',
});

const resetTouched = (): TouchedInput => ({
  [Storage.Raw]: false,
  [Storage.Slabbed]: false,
  length: false,
  width: false,
  height: false,
});

const getError = (
  input: string,
  allowedDecimal = false,
  mustContain = false
): string => {
  if (allowedDecimal ? isNumber(input) : isWholeNumber(input)) {
    const raw = parseFloat(input);
    if (raw < 0) {
      return 'Enter a number greater than or equal to 0';
    }
  } else if (input) {
    if (isNumber(input)) {
      return 'Enter a whole number';
    } else {
      return 'Enter a valid number';
    }
  }

  if (!input && mustContain) {
    return 'Must contain a number';
  }

  return '';
};

const validate = (values: FormState): FormError => {
  let errors: FormError = blankFormError();

  errors.Raw = getError(values.Raw);
  errors.Slabbed = getError(values.Slabbed);

  const { hasSealed } = values;
  if (hasSealed) {
    errors.length = getError(values.length, true, true);
    errors.width = getError(values.width, true, true);
    errors.height = getError(values.height, true, true);
    if (volumeOfSealed(values) < MIN_SEALED_VOLUME) {
      errors.volume = `Volume must be greater than ${MIN_SEALED_VOLUME} cm3`;
    }
  }

  return errors;
};

const getPrice = (values: FormState): number => {
  let price = 0;
  const raw = parseFloat(values.Raw);
  if (!isNaN(raw)) {
    price += raw * 0.7;
  }
  const slabbed = parseFloat(values.Slabbed);
  if (!isNaN(slabbed)) {
    price += slabbed * 1;
  }
  const { hasSealed } = values;
  const volume = volumeOfSealed(values);
  if (hasSealed && volume && MIN_SEALED_VOLUME <= volume) {
    price += volume * 0.001388888889;
  }
  if (values.term === Term.Yearly) {
    price *= 12;
  }
  if (price < 0) {
    price = 0;
  }
  return price;
};

const buildCart = (values: FormState) => {
  let items = [];
  if (containsNumber(values.Raw)) {
    items.push({
      quantity: parseFloat(values.Raw),
      price: priceMatrix[values.term][Storage.Raw].id,
    });
  }
  if (containsNumber(values.Slabbed)) {
    items.push({
      quantity: parseFloat(values.Slabbed),
      price: priceMatrix[values.term][Storage.Slabbed].id,
    });
  }
  const volume = volumeOfSealed(values);
  if (!isNaN(volume) && volume >= MIN_SEALED_VOLUME) {
    let quantity = Math.round(volume * 0.001388888889) * 100;
    if (values.term === Term.Yearly) {
      quantity = Math.round(volume * 0.01666666667) * 100;
    }
    items.push({
      quantity,
      price: priceMatrix[values.term][Storage.Sealed].id,
    });
  }
  return { items };
};

const useSubscriptionForm = (
  initialValues: FormState,
  onSubmit: (cart: Cart) => void
): [
  FormState,
  FormError,
  TouchedInput,
  (event: React.ChangeEvent<HTMLInputElement>) => void,
  (term: Term) => void,
  () => void,
  number,
  (event: React.ChangeEvent<HTMLInputElement>) => void,
  (event: React.FormEvent<HTMLAnchorElement>) => void,
  boolean
] => {
  const [values, setValues] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState<FormError>(blankFormError());
  const [touched, setTouched] = useState<TouchedInput>(resetTouched());
  const [price, setPrice] = useState(0);
  const [onSubmitting, setOnSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  const formRendered = useRef(true);
  useEffect(() => {
    if (formRendered.current) {
      setValues(initialValues);
      setErrors(blankFormError());
      setTouched(resetTouched());
      setDidSubmit(false);
      setOnSubmitting(false);
    }
    formRendered.current = false;
  }, [initialValues]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { name, value } = target;
    event.persist();
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    setPrice(getPrice(newValues));
    setErrors(validate(newValues));
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { name } = target;
    setTouched({ ...touched, [name]: true });
  };

  const handleSubmit = async (event: any) => {
    if (onSubmitting) {
      return;
    }
    setOnSubmitting(true);
    if (event) {
      event.preventDefault();
    }
    const newErrors = validate(values);
    setErrors(newErrors);
    if (
      !isEqual(values, initialValues) &&
      !(
        newErrors.Raw ||
        newErrors.Slabbed ||
        newErrors.volume ||
        newErrors.length ||
        newErrors.width ||
        newErrors.height
      )
    ) {
      onSubmit(buildCart(values));
    }
    setOnSubmitting(false);
    setDidSubmit(true);
  };

  const setTerm = (term: Term) => {
    const newValues = { ...values, term };
    setValues(newValues);
    setPrice(getPrice(newValues));
  };

  const toggleHasSealed = () => {
    const newValues = {
      ...values,
      hasSealed: !values.hasSealed,
    };
    setValues(newValues);
    setPrice(getPrice(newValues));
  };

  return [
    values,
    errors,
    touched,
    handleChange,
    setTerm,
    toggleHasSealed,
    price,
    handleBlur,
    handleSubmit,
    didSubmit,
  ];
};

export default useSubscriptionForm;
