import React from 'react';
import styles from './SubscriptionForm.module.scss';
import SubscriptionTerm from '../SubscriptionTerm';
import NumericInput from '../NumericInput';
import CheckoutButton from '../CheckoutButton';
import Switch from '../Switch';
import useSubscriptionForm from '../../hooks/useSubscriptionForm';
import { Cart, Storage, Term } from '../../util/products';
import getStripe from '../../util/get-stripe';
import { fetchPostJSON } from '../../util/api-helpers';

interface SubscribeFormProps {
  subscribeRef: React.RefObject<HTMLDivElement>;
  isLoggedIn: boolean;
}

const initialValues = {
  term: Term.Monthly,
  [Storage.Raw]: '',
  [Storage.Slabbed]: '',
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
    setTerm,
    toggleHasSealed,
    price,
    handleBlur,
    handleSubmit,
    didSubmit,
    savings,
  ] = useSubscriptionForm(initialValues, async (items: Cart) => {
    // create a checkout session
    const res = await fetchPostJSON('/api/create-checkout-session', items);

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

  const { Slabbed, Raw, hasSealed, length, width, height } = values;

  return (
    <section ref={subscribeRef} className={styles.subscription}>
      <div className="container">
        <form className={styles.form}>
          <h1>Subscribe Now</h1>
          <div className={styles.priceContainer}>
            <h2>${price.toFixed(2)}</h2>
            {values.term === Term.Yearly && !isNaN(savings) && (
              <p className={styles.savings}>{`SAVE ${savings.toFixed(2)}%`}</p>
            )}
          </div>
          <div className={styles.terms}>
            <SubscriptionTerm
              isOn={values.term === Term.Monthly}
              setTerm={setTerm}
              term={Term.Monthly}
            />
            <SubscriptionTerm
              isOn={values.term === Term.Yearly}
              setTerm={setTerm}
              term={Term.Yearly}
            />
          </div>

          <div className={styles.productTypes}>
            <h3>Product Type</h3>
            <NumericInput
              fieldName={'Raw'}
              handleBlur={handleBlur}
              handleChange={handleChange}
              value={Raw}
            />
            {errors.Raw && (touched.Raw || didSubmit) && (
              <p className={styles.errors}>{errors.Raw}</p>
            )}
            <NumericInput
              fieldName={'Slabbed'}
              handleBlur={handleBlur}
              handleChange={handleChange}
              value={Slabbed}
            />
            {errors.Slabbed && (touched.Slabbed || didSubmit) && (
              <p className={styles.errors}>{errors.Slabbed}</p>
            )}
            <Switch toggle={toggleHasSealed} />
          </div>
          {hasSealed && (
            <div className={styles.productTypes}>
              <h3>Sealed Dimensions</h3>
              <NumericInput
                fieldName={'Length'}
                placeHolder={'Centimeters'}
                handleBlur={handleBlur}
                handleChange={handleChange}
                value={length}
              />
              {errors.length && (touched.length || didSubmit) && (
                <p className={styles.errors}>{errors.length}</p>
              )}
              <NumericInput
                fieldName={'Width'}
                placeHolder={'Centimeters'}
                handleBlur={handleBlur}
                handleChange={handleChange}
                value={width}
              />
              {errors.width && (touched.width || didSubmit) && (
                <p className={styles.errors}>{errors.width}</p>
              )}
              <NumericInput
                fieldName={'Height'}
                placeHolder={'Centimeters'}
                handleBlur={handleBlur}
                handleChange={handleChange}
                value={height}
              />
              {errors.height && (touched.height || didSubmit) && (
                <p className={styles.errors}>{errors.height}</p>
              )}
              {errors.volume &&
                ((touched.length && touched.width && touched.height) ||
                  didSubmit) && (
                  <p className={styles.errors}>{errors.volume}</p>
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
