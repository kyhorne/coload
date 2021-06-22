import React, { useEffect, useRef, useState } from 'react';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';
import { priceMatrix, StorageType, Term } from '../util/products';
import getStripe from '../util/get-stripe';
import { fetchPostJSON } from '../util/api-helpers';

interface Size {
  length: string;
  width: string;
  height: string;
}

interface FormState extends Size {
  term: Term;
  [StorageType.Raw]: string;
  [StorageType.Slabbed]: string;
  hasSealed: boolean;
}

interface FormError {
  [StorageType.Raw]: string;
  [StorageType.Slabbed]: string;
  [StorageType.Sealed]: {
    size: Size;
    volume: string;
  };
}

interface TouchedInput {
  [StorageType.Raw]: boolean;
  [StorageType.Slabbed]: boolean;
  [StorageType.Sealed]: {
    size: {
      length: boolean;
      width: boolean;
      height: boolean;
    };
  };
}

const blankFormError = (): FormError => ({
  [StorageType.Raw]: '',
  [StorageType.Sealed]: {
    size: {
      length: '',
      width: '',
      height: '',
    },
    volume: '',
  },
  [StorageType.Slabbed]: '',
});

const resetTouched = (): TouchedInput => ({
  [StorageType.Raw]: false,
  [StorageType.Sealed]: {
    size: {
      length: false,
      width: false,
      height: false,
    },
  },
  [StorageType.Slabbed]: false,
});

const MIN_SEALED_VOLUME = 650;

const valueToFloat = (size: Size): [number, number, number] => {
  const length = parseFloat(size.length);
  const width = parseFloat(size.width);
  const height = parseFloat(size.height);
  return [length, width, height];
};

const volumeOfSealed = (size: Size): number => {
  const [length, width, height] = valueToFloat(size);
  if (!isNaN(length) && !isNaN(width) && !isNaN(height)) {
    return length * width * height;
  }
  return 0;
};

const validate = (newValues: FormState): FormError => {
  let errors: FormError = blankFormError();

  const raw = parseFloat(newValues.Raw);
  if (isNaN(raw)) {
    errors.Raw = 'Enter a valid number';
  } else if (raw < 0) {
    errors.Raw = 'Enter a number greater than or equal to 0';
  }

  const slabbed = parseFloat(newValues.Slabbed);
  if (isNaN(slabbed)) {
    errors.Slabbed = 'Enter a valid number';
  } else if (slabbed < 0) {
    errors.Slabbed = 'Enter a number greater than or equal to 0';
  }

  const { hasSealed } = newValues;
  if (hasSealed) {
    const [length, width, height] = valueToFloat(newValues);
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
    if (volumeOfSealed(newValues) < MIN_SEALED_VOLUME) {
      errors.Sealed.volume = `Volume must be greater than ${MIN_SEALED_VOLUME} cm3`;
    }
  }
  return errors;
};

const getPrice = (newValues: FormState): number => {
  let price = 0;
  const raw = parseFloat(newValues.Raw);
  if (!isNaN(raw)) {
    price += raw * 0.7;
  }
  const slabbed = parseFloat(newValues.Slabbed);
  if (!isNaN(slabbed)) {
    price += slabbed * 1;
  }
  const { hasSealed } = newValues;
  const volume = volumeOfSealed(newValues);
  if (hasSealed && volume && MIN_SEALED_VOLUME <= volume) {
    price += volume * 0.001388888889;
  }
  if (newValues.term === Term.Yearly) {
    price *= 12;
  }
  if (price < 0) {
    price = 0;
  }
  return price;
};

const useSubscriptionForm = (
  initialValues: FormState
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
    console.log(newValues);
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
      let items = [];
      const raw = parseFloat(values.Raw);
      if (!isNaN(raw)) {
        items.push({
          quantity: raw,
          price: priceMatrix[values.term][StorageType.Raw],
        });
      }
      const slabbed = parseFloat(values.Slabbed);
      if (!isNaN(slabbed)) {
        items.push({
          quantity: slabbed,
          price: priceMatrix[values.term][StorageType.Slabbed],
        });
      }
      const volume = volumeOfSealed(values);
      console.log(volume);
      if (!isNaN(volume) && volume >= MIN_SEALED_VOLUME) {
        let quantity = Math.round(volume * 0.001388888889) * 100;
        if (values.term === Term.Yearly) {
          quantity = Math.round(volume * 0.01666666667) * 100;
        }
        items.push({
          quantity,
          price: priceMatrix[values.term][StorageType.Sealed],
        });
      }
      // create a checkout session
      const res = await fetchPostJSON('/api/create-checkout-session', {
        items,
      });

      if (res.statusCode === 500) {
        console.error(res.message);
        return;
      }

      // redirect to checkout
      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
        sessionId: res.id,
      });
      console.warn(error.message);
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
