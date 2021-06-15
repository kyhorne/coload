import React, { useCallback, useState } from 'react';
import styles from './SubscribeForm.module.scss';
import SubscriptionTerm from '../SubscriptionTerm';
import NumericInput from '../NumericInput';
import CheckoutButton from '../CheckoutButton';
import Switch from '../Switch';
import { useFormik } from 'formik';

interface SubscribeFormProps {
  subscribeRef: React.RefObject<HTMLDivElement>;
}

enum Term {
  Monthly,
  Annually,
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({ subscribeRef }) => {
  const [isMonthly, setIsMonthly] = useState(true);
  const setMonthly = useCallback(() => setIsMonthly(true), [isMonthly]);
  const setAnnually = useCallback(() => setIsMonthly(false), [isMonthly]);

  return (
    <section ref={subscribeRef} className={styles.subscription}>
      <form className={styles.form}>
        <h1>Subsribe Now</h1>
        <h2>$12.31</h2>
        <div className={styles.terms}>
          <SubscriptionTerm
            updateTerm={setMonthly}
            backgroundColor={isMonthly ? '#00ebc7' : 'transparent'}
            color={isMonthly ? '#00214d' : '#fffffe'}
            text={'Monthly'}
          />
          <SubscriptionTerm
            updateTerm={setAnnually}
            backgroundColor={isMonthly ? 'transparent' : '#00ebc7'}
            color={isMonthly ? '#fffffe' : '#00214d'}
            text={'Anually'}
          />
        </div>
        <div className={styles.productTypes}>
          <h3>Product Type</h3>
          <NumericInput text={'Raw'} />
          <NumericInput text={'Slabbed'} />
          <Switch />
        </div>
        <CheckoutButton />
      </form>
    </section>
  );
};

export default SubscribeForm;
