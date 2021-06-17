import React, { useEffect, useRef, useState } from 'react';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';

export enum Term {
  Monthly = 'Monthly',
  Anuallly = 'Annually',
}

interface FormState {
  term: Term;
  raw: string;
  slabbed: string;
  hasSealed: boolean;
  length: string;
  width: string;
  height: string;
}

const useSubscriptionForm = (
  initialValues: FormState,
  onSubmit: (values: FormState) => void
): [
  FormState,
  any,
  any,
  any,
  (term: Term) => void,
  () => void,
  number,
  any,
  any
] => {
  const [values, setValues] = useState<FormState>(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [price, setPrice] = useState<number>(0);
  const [onSubmitting, setOnSubmitting] = useState<boolean>(false);

  const formRendered = useRef(true);
  useEffect(() => {
    if (formRendered.current) {
      setValues(initialValues);
      setErrors({});
      setTouched({});
      setOnSubmitting(false);
    }
    formRendered.current = false;
  }, [initialValues]);

  const updatePrice = (newValues: FormState) => {
    let price = 0;
    const raw = parseFloat(newValues.raw);
    if (!isNaN(raw)) {
      price += raw * 0.7;
    }
    const slabbed = parseFloat(newValues.slabbed);
    if (!isNaN(slabbed)) {
      price += slabbed * 1;
    }
    const length = parseFloat(newValues.length);
    const width = parseFloat(newValues.width);
    const height = parseFloat(newValues.height);
    if (
      newValues.hasSealed &&
      !isNaN(length) &&
      !isNaN(width) &&
      !isNaN(height)
    ) {
      price +=
        2 * (width * length + height * length + height * width) * 0.00119047619;
    }
    if (newValues.term === Term.Anuallly) {
      price *= 12;
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
    let errors: any = {};

    const raw = parseFloat(newValues.raw);
    if (isNaN(raw)) {
      errors.raw = 'Enter a valid number';
    } else if (raw < 0) {
      errors.raw = 'Enter a number greater than or equal to 0';
    }

    const slabbed = parseFloat(newValues.slabbed);
    if (isNaN(slabbed)) {
      errors.slabbed = 'Enter a valid number';
    } else if (slabbed < 0) {
      errors.slabbed = 'Enter a number greater than or equal to 0';
    }

    if (newValues.hasSealed) {
      const length = parseFloat(newValues.length);
      const width = parseFloat(newValues.width);
      const height = parseFloat(newValues.height);
      if (isNaN(width)) {
        errors.width = 'Enter a valid number';
      } else if (width < 0) {
        errors.width = 'Enter a number greater than or equal to 0';
      }
      if (isNaN(height)) {
        errors.height = 'Enter a valid number';
      } else if (height < 0) {
        errors.height = 'Enter a number greater than or equal to 0';
      }
      if (isNaN(length)) {
        errors.length = 'Enter a valid number';
      } else if (length < 0) {
        errors.length = 'Enter a number greater than or equal to 0';
      }
      if (
        !isNaN(length) &&
        !isNaN(width) &&
        !isNaN(height) &&
        2 * (width * length + height * length + height * width) < 1000
      ) {
        errors.sealed = 'Volume must be greater than 1000 cm3';
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
    if (!isEqual(values, initialValues) && isEmpty(errors)) {
      onSubmit(values);
    }
    setOnSubmitting(false);
  };

  const updateTerm = (term: Term) => {
    const newValues = { ...values, term };
    setValues(newValues);
    updatePrice(newValues);
  };

  const toggleHasSealed = () => {
    const newValues = { ...values, hasSealed: !values.hasSealed };
    setValues(newValues);
    updatePrice(newValues);
  };

  return [
    values,
    errors,
    touched,
    handleChange,
    updateTerm,
    toggleHasSealed,
    price,
    handleBlur,
    handleSubmit,
  ];
};

export default useSubscriptionForm;
