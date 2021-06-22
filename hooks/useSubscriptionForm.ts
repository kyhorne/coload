import React, { useEffect, useRef, useState } from 'react';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';
import { StorageType, Term } from '../util/products';

const priceMatrix = {
  [Term.Monthly]: {
    [StorageType.Raw]: {
      quantity: 0,
      price: '',
    },
    [StorageType.Slabbed]: {
      quantity: 0,
      price: '',
    },
    [StorageType.Sealed]: {
      quantity: 0,
      price: '',
    },
  },
  [Term.Anuallly]: {
    [StorageType.Raw]: {
      quantity: 0,
      price: '',
    },
    [StorageType.Slabbed]: {
      quantity: 0,
      price: '',
    },
    [StorageType.Sealed]: {
      quantity: 0,
      price: '',
    },
  },
};

interface FormState {
  term: Term;
  [StorageType.Raw]: string;
  [StorageType.Slabbed]: string;
  [StorageType.Sealed]: {
    hasSealed: boolean;
    size: {
      length: string;
      width: string;
      height: string;
    };
  };
}

interface FormError {
  [StorageType.Raw]: string;
  [StorageType.Slabbed]: string;
  [StorageType.Sealed]: {
    size: {
      length: string;
      width: string;
      height: string;
    };
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

const useSubscriptionForm = (
  initialValues: FormState,
  onSubmit: (values: FormState) => void
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

  const volume = (length: number, width: number, height: number): number => {
    return 2 * (width * length + height * length + height * width);
  };

  const updatePrice = (newValues: FormState) => {
    let price = 0;
    const raw = parseFloat(newValues.Raw);
    if (!isNaN(raw)) {
      price += raw * 0.7;
    }
    const slabbed = parseFloat(newValues.Slabbed);
    if (!isNaN(slabbed)) {
      price += slabbed * 1;
    }
    const { size, hasSealed } = newValues.Sealed;
    const length = parseFloat(size.length);
    const width = parseFloat(size.width);
    const height = parseFloat(size.height);
    if (
      hasSealed &&
      !isNaN(length) &&
      !isNaN(width) &&
      !isNaN(height) &&
      volume(length, width, height) >= 1000
    ) {
      price += volume(length, width, height) * 0.00119047619;
    }
    if (newValues.term === Term.Anuallly) {
      price *= 12;
    }
    if (price < 0) {
      price = 0;
    }
    setPrice(price);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { name, value } = target;
    event.persist();
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    updatePrice(newValues);
    validate(newValues);
  };

  const validate = (newValues: FormState) => {
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

    const { hasSealed, size } = newValues.Sealed;
    if (hasSealed) {
      const length = parseFloat(size.length);
      const width = parseFloat(size.width);
      const height = parseFloat(size.height);
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
      if (
        !isNaN(length) &&
        !isNaN(width) &&
        !isNaN(height) &&
        volume(length, width, height) < 1000
      ) {
        errors.Sealed.volume = 'Volume must be greater than 1000 cm3';
      }
    }
    setErrors(errors);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { name } = target;
    setTouched({ ...touched, [name]: true });
    validate(values);
  };

  const handleSubmit = (event: any) => {
    if (onSubmitting) {
      return;
    }
    setOnSubmitting(true);
    if (event) {
      event.preventDefault();
    }
    validate(values);
    if (
      !isEqual(values, initialValues) /* && isEmpty(errors) && price !== 0  */
    ) {
      onSubmit(values);
    }
    setOnSubmitting(false);
  };

  const setTerm = (term: Term) => {
    const newValues = { ...values, term };
    setValues(newValues);
    updatePrice(newValues);
  };

  const toggleHasSealed = () => {
    const newValues = {
      ...values,
      sealed: { ...values.Sealed, hasSealed: !values },
    };
    setValues(newValues);
    updatePrice(newValues);
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
