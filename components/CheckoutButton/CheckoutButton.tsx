import React from 'react';
import styles from './CheckoutButton.module.scss';

const CheckoutButton = () => (
  <div className={styles.buttonContainer}>
    <a type="submit" className={styles.checkoutButton}>
      Checkout
    </a>
  </div>
);

export default CheckoutButton;
