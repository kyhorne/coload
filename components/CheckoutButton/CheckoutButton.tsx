import React from 'react';
import styles from './CheckoutButton.module.scss';

interface CheckoutButtonProps {
  handleSubmit: (event: React.FormEvent<HTMLAnchorElement>) => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ handleSubmit }) => (
  <div className={styles.buttonContainer}>
    <a className={styles.checkoutButton} onClick={handleSubmit}>
      Checkout
    </a>
  </div>
);

export default CheckoutButton;
