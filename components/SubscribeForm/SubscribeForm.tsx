import React, { useEffect, useRef, useState } from 'react';
import styles from './SubscribeForm.module.scss';
import SubscriptionTerm from '../SubscriptionTerm';
import NumericInput from '../NumericInput';
import CheckoutButton from '../CheckoutButton';
import Switch from '../Switch';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';

interface SubscribeFormProps {
  subscribeRef: React.RefObject<HTMLDivElement>;
  isLoggedIn: boolean;
}

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

const initialValues = {
  term: Term.Monthly,
  raw: '',
  slabbed: '',
  hasSealed: false,
  length: '',
  width: '',
  height: '',
};

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

  const updatePrice = () => {
    let price = 0;
    const raw = parseFloat(values.raw);
    if (!isNaN(raw)) {
      price += raw * 0.7;
    }
    const slabbed = parseFloat(values.slabbed);
    if (!isNaN(slabbed)) {
      price += slabbed * 1;
    }
    const length = parseFloat(values.length);
    const width = parseFloat(values.width);
    const height = parseFloat(values.height);
    if (values.hasSealed && !isNaN(length) && !isNaN(width) && !isNaN(height)) {
      price +=
        2 * (width * length + height * length + height * width) * 0.00119047619;
    }
    if (values.term === Term.Anuallly) {
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
    updatePrice();
    validate();
  };

  const validate = () => {
    let errors: any = {};

    const raw = parseFloat(values.raw);
    if (isNaN(raw)) {
      errors.raw = 'Enter a valid number';
    } else if (raw < 0) {
      errors.raw = 'Enter a number greater than or equal to 0';
    }

    const slabbed = parseFloat(values.slabbed);
    if (isNaN(slabbed)) {
      errors.slabbed = 'Enter a valid number';
    } else if (slabbed < 0) {
      errors.slabbed = 'Enter a number greater than or equal to 0';
    }

    if (values.hasSealed) {
      const length = parseFloat(values.length);
      const width = parseFloat(values.width);
      const height = parseFloat(values.height);
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
    validate();
  };

  const handleSubmit = (event: any) => {
    if (onSubmitting) {
      return;
    }
    setOnSubmitting(true);
    if (event) {
      event.preventDefault();
    }
    validate();
    if (!isEqual(values, initialValues) && isEmpty(errors)) {
      onSubmit(values);
    }
    setOnSubmitting(false);
  };

  const updateTerm = (term: Term) => {
    setValues({ ...values, term });
    updatePrice();
  };

  const toggleHasSealed = () => {
    setValues({ ...values, hasSealed: !values.hasSealed });
    updatePrice();
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

const SubscribeForm: React.FC<SubscribeFormProps> = ({
  subscribeRef,
  isLoggedIn,
}) => {
  const [
    values,
    errors,
    touched,
    handleChange,
    updateTerm,
    toggleHasSealed,
    price,
    handleBlur,
    handleSubmit,
  ] = useSubscriptionForm(initialValues, () => {
    console.log('submitted');
  });

  return (
    <section ref={subscribeRef} className={styles.subscription}>
      <div className="container">
        <form className={styles.form}>
          <h1>Subscribe Now</h1>
          <h2>${price.toFixed(2)}</h2>
          <div className={styles.terms}>
            <SubscriptionTerm
              isOn={values.term === Term.Monthly}
              updateTerm={updateTerm}
              term={Term.Monthly}
            />
            <SubscriptionTerm
              isOn={values.term === Term.Anuallly}
              updateTerm={updateTerm}
              term={Term.Anuallly}
            />
          </div>
          <div className={styles.productTypes}>
            <h3>Product Type</h3>
            <NumericInput
              fieldName={'Raw'}
              handleBlur={handleBlur}
              handleChange={handleChange}
              value={values.raw}
            />
            {errors.raw && touched.raw && (
              <p className={styles.errors}>{errors.raw}</p>
            )}
            <NumericInput
              fieldName={'Slabbed'}
              handleBlur={handleBlur}
              handleChange={handleChange}
              value={values.slabbed}
            />
            {errors.slabbed && touched.slabbed && (
              <p className={styles.errors}>{errors.slabbed}</p>
            )}
            <Switch toggle={toggleHasSealed} />
          </div>
          {values.hasSealed && (
            <div className={styles.productTypes}>
              <h3>Sealed Dimensions</h3>
              <NumericInput
                fieldName={'Length'}
                placeHolder={'Centimeters'}
                handleBlur={handleBlur}
                handleChange={handleChange}
                value={values.length}
              />
              {errors.length && touched.length && (
                <p className={styles.errors}>{errors.length}</p>
              )}
              <NumericInput
                fieldName={'Width'}
                placeHolder={'Centimeters'}
                handleBlur={handleBlur}
                handleChange={handleChange}
                value={values.width}
              />
              {errors.width && touched.width && (
                <p className={styles.errors}>{errors.width}</p>
              )}
              <NumericInput
                fieldName={'Height'}
                placeHolder={'Centimeters'}
                handleBlur={handleBlur}
                handleChange={handleChange}
                value={values.height}
              />
              {errors.height && touched.height && (
                <p className={styles.errors}>{errors.height}</p>
              )}
              {errors.sealed &&
                touched.length &&
                touched.width &&
                touched.height && (
                  <p className={styles.errors}>{errors.sealed}</p>
                )}
            </div>
          )}
          <CheckoutButton handleSubmit={handleSubmit} isLoggedIn={isLoggedIn} />
        </form>
      </div>
    </section>
  );
};

export default SubscribeForm;
