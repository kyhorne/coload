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
          <h2>${price.toFixed(2)}</h2>
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
            {errors.Raw && touched.Raw && (
              <p className={styles.errors}>{errors.Raw}</p>
            )}
            <NumericInput
              fieldName={'Slabbed'}
              handleBlur={handleBlur}
              handleChange={handleChange}
              value={Slabbed}
            />
            {errors.Slabbed && touched.Slabbed && (
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
              {errors.Sealed.size.length && touched.Sealed.size.length && (
                <p className={styles.errors}>{errors.Sealed.size.length}</p>
              )}
              <NumericInput
                fieldName={'Width'}
                placeHolder={'Centimeters'}
                handleBlur={handleBlur}
                handleChange={handleChange}
                value={width}
              />
              {errors.Sealed.size.width && touched.Sealed.size.width && (
                <p className={styles.errors}>{errors.Sealed.size.width}</p>
              )}
              <NumericInput
                fieldName={'Height'}
                placeHolder={'Centimeters'}
                handleBlur={handleBlur}
                handleChange={handleChange}
                value={height}
              />
              {errors.Sealed.size.height && touched.Sealed.size.height && (
                <p className={styles.errors}>{errors.Sealed.size.height}</p>
              )}
              {errors.Sealed.volume &&
                touched.Sealed.size.length &&
                touched.Sealed.size.width &&
                touched.Sealed.size.height && (
                  <p className={styles.errors}>{errors.Sealed.volume}</p>
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
