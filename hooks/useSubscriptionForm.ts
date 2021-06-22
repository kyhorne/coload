import React, { useEffect, useRef, useState } from 'react';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';
import {
  Cart,
  MIN_SEALED_VOLUME,
  priceMatrix,
  Size,
  Storage,
  Term,
  valueOfSize,
  volumeOfSealed,
} from '../util/products';

interface FormState extends Size {
  term: Term;
  [Storage.Raw]: string;
  [Storage.Slabbed]: string;
  hasSealed: boolean;
}

interface FormError {
  [Storage.Raw]: string;
  [Storage.Slabbed]: string;
  [Storage.Sealed]: {
    size: Size;
    volume: string;
  };
}

interface TouchedInput {
  [Storage.Raw]: boolean;
  [Storage.Slabbed]: boolean;
  [Storage.Sealed]: {
    size: {
      length: boolean;
      width: boolean;
      height: boolean;
    };
  };
}

const blankFormError = (): FormError => ({
  [Storage.Raw]: '',
  [Storage.Sealed]: {
    size: {
      length: '',
      width: '',
      height: '',
    },
    volume: '',
  },
  [Storage.Slabbed]: '',
});

const resetTouched = (): TouchedInput => ({
  [Storage.Raw]: false,
  [Storage.Sealed]: {
    size: {
      length: false,
      width: false,
      height: false,
    },
  },
  [Storage.Slabbed]: false,
});

const validate = (values: FormState): FormError => {
  let errors: FormError = blankFormError();

  const raw = parseFloat(values.Raw);
  if (isNaN(raw)) {
    errors.Raw = 'Enter a valid number';
  } else if (raw < 0) {
    errors.Raw = 'Enter a number greater than or equal to 0';
  }

  const slabbed = parseFloat(values.Slabbed);
  if (isNaN(slabbed)) {
    errors.Slabbed = 'Enter a valid number';
  } else if (slabbed < 0) {
    errors.Slabbed = 'Enter a number greater than or equal to 0';
  }

  const { hasSealed } = values;
  if (hasSealed) {
    const [length, width, height] = valueOfSize(values);
    if (isNaN(length)) {
      errors.Sealed.size.length = 'Enter a valid number';
    } else if (length < 0) {
      errors.Sealed.size.length = 'Enter a number greater than or equal to 0';
    }
    if (isNaN(width)) {
      errors.Sealed.size.width = 'Enter a valid number';
    } else if (width < 0) {
      errors.Sealed.size.width = 'Enter a number greater than or equal to 0';
    }
    if (isNaN(height)) {
      errors.Sealed.size.height = 'Enter a valid number';
    } else if (height < 0) {
      errors.Sealed.size.height = 'Enter a number greater than or equal to 0';
    }
    if (volumeOfSealed(values) < MIN_SEALED_VOLUME) {
      errors.Sealed.volume = `Volume must be greater than ${MIN_SEALED_VOLUME} cm3`;
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
  const raw = parseFloat(values.Raw);
  const slabbed = parseFloat(values.Slabbed);
  const volume = volumeOfSealed(values);
  let items = [];
  if (!isNaN(raw)) {
    items.push({
      quantity: raw,
      price: priceMatrix[values.term][Storage.Raw].id,
    });
  }
  if (!isNaN(slabbed)) {
    items.push({
      quantity: slabbed,
      price: priceMatrix[values.term][Storage.Slabbed].id,
    });
  }
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
  (event: React.FormEvent<HTMLAnchorElement>) => void
] => {
  const [values, setValues] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState<FormError>(blankFormError());
  const [touched, setTouched] = useState<TouchedInput>(resetTouched());
  const [price, setPrice] = useState(0);
  const [onSubmitting, setOnSubmitting] = useState(false);

  const formRendered = useRef(true);
  useEffect(() => {
    if (formRendered.current) {
      setValues(initialValues);
      setErrors(blankFormError());
      setTouched(resetTouched());
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
    setErrors(validate(values));
    if (
      !isEqual(values, initialValues) /* && isEmpty(errors) && price !== 0  */
    ) {
      onSubmit(buildCart(values));
    }
    setOnSubmitting(false);
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
  ];
};

export default useSubscriptionForm;
