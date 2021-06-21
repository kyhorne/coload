import React from 'react';
import styles from './SubscriptionForm.module.scss';
import SubscriptionTerm from '../SubscriptionTerm';
import NumericInput from '../NumericInput';
import CheckoutButton from '../CheckoutButton';
import Switch from '../Switch';
import useSubscriptionForm, { Term } from '../../hooks/useSubscriptionForm';
import getStripe from '../../util/get-stripe';
import { fetchPostJSON } from '../../util/api-helpers';

interface SubscribeFormProps {
  subscribeRef: React.RefObject<HTMLDivElement>;
  isLoggedIn: boolean;
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

const SubscriptionForm: React.FC<SubscribeFormProps> = ({
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
  ] = useSubscriptionForm(initialValues, async () => {
    // create a checkout session
    const res = await fetchPostJSON('/api/create-checkout-session', {
      items: [
        {
          quantity: 20,
          price: 'price_1J4vIgLaNzAt04peVdnamR9E',
        },
        {
          quantity: 10,
          price: 'price_1J4vO9LaNzAt04peqeaWfO4h',
        },
      ],
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

export default SubscriptionForm;
