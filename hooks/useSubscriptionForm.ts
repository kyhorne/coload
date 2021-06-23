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

const getTotal = (values: FormState, errors: FormError): number => {
  let price = 0;
  if (!errors.Raw && values.Raw) {
    price +=
      parseFloat(values.Raw) * priceMatrix[values.term][Storage.Raw].price;
  }
  if (!errors.Slabbed && values.Slabbed) {
    price +=
      parseFloat(values.Slabbed) *
      priceMatrix[values.term][Storage.Slabbed].price;
  }
  const volume = volumeOfSealed(values);
  if (
    volume > 0 &&
    !errors.length &&
    !errors.width &&
    !errors.height &&
    !errors.volume
  ) {
    price += volume * priceMatrix[values.term][Storage.Sealed].price;
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
  if (volume >= MIN_SEALED_VOLUME) {
    items.push({
      quantity: Math.round(
        volume * priceMatrix[values.term][Storage.Sealed].price * 100
      ),
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
    const newErrors = validate(newValues);
    setPrice(getTotal(newValues, newErrors));
    setErrors(newErrors);
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
    setPrice(getTotal(newValues, errors));
  };

  const toggleHasSealed = () => {
    const newValues = {
      ...values,
      hasSealed: !values.hasSealed,
    };
    setValues(newValues);
    setPrice(getTotal(newValues, errors));
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
