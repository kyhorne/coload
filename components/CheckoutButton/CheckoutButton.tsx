import React from 'react';
import styles from './CheckoutButton.module.scss';

interface CheckoutButtonProps {
  handleSubmit: (event: React.FormEvent<HTMLAnchorElement>) => void;
  isLoggedIn: boolean;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  handleSubmit,
  isLoggedIn,
}) => (
  <div className={styles.buttonContainer}>
    {isLoggedIn ? (
      <a className={styles.checkoutButton} onClick={handleSubmit}>
        Checkout
      </a>
    ) : (
      <a href="/api/auth/login" className={styles.checkoutButton}>
        Login
      </a>
    )}
  </div>
);

export default CheckoutButton;
