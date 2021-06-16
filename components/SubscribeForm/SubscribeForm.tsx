import React, { useEffect, useRef, useState } from 'react';
import styles from './SubscribeForm.module.scss';
import SubscriptionTerm from '../SubscriptionTerm';
import NumericInput from '../NumericInput';
import CheckoutButton from '../CheckoutButton';
import Switch from '../Switch';

interface SubscribeFormProps {
  subscribeRef: React.RefObject<HTMLDivElement>;
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
  onSubmit: (event: any) => void
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
  const [onBlur, setOnBlur] = useState<boolean>(false);

  const formRendered = useRef(true);

  useEffect(() => {
    if (formRendered.current) {
      setValues(initialValues);
      setErrors({});
      setTouched({});
      setOnSubmitting(false);
      setOnBlur(false);
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
    updatePrice(newValues);
    setValues(newValues);
  };

  const handleBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const { name } = target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors });
  };

  const handleSubmit = (event: any) => {
    if (event) {
      event.preventDefault();
    }
    setErrors({ ...errors });
    onSubmit({ values, errors });
  };

  const updateTerm = (term: Term) => {
    const newValues = { ...values, term };
    updatePrice(newValues);
    setValues(newValues);
  };

  const toggleHasSealed = () => {
    const newValues = { ...values, hasSealed: !values.hasSealed };
    updatePrice(newValues);
    setValues(newValues);
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

const SubscribeForm: React.FC<SubscribeFormProps> = ({ subscribeRef }) => {
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
    console.log(values);
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
              handleChange={handleChange}
              value={values.raw}
            />
            <NumericInput
              fieldName={'Slabbed'}
              handleChange={handleChange}
              value={values.slabbed}
            />
            <Switch toggle={toggleHasSealed} />
          </div>
          {values.hasSealed && (
            <div className={styles.productTypes}>
              <h3>Dimensions</h3>
              <NumericInput
                fieldName={'Length'}
                placeHolder={'Centimeters'}
                handleChange={handleChange}
                value={values.length}
              />
              <NumericInput
                fieldName={'Width'}
                placeHolder={'Centimeters'}
                handleChange={handleChange}
                value={values.width}
              />
              <NumericInput
                fieldName={'Height'}
                placeHolder={'Centimeters'}
                handleChange={handleChange}
                value={values.height}
              />
            </div>
          )}
          <CheckoutButton handleSubmit={handleSubmit} />
        </form>
      </div>
    </section>
  );
};

export default SubscribeForm;
