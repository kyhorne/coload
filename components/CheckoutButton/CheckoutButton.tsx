import React from 'react';
import styles from './CheckoutButton.module.scss';

interface CheckoutButtonProps {
  isSubmitting: boolean;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ isSubmitting }) => (
  <div className={styles.buttonContainer}>
    <a className={styles.checkoutButton}>Checkout</a>
  </div>
);

export default CheckoutButton;
