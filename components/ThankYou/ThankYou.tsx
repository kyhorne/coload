import React from 'react';
import styles from './ThankYou.module.scss';

const ThankYou = () => (
  <section className={styles.bg}>
    <div className={`container ${styles.cardContainer}`}>
      <div className={styles.card}>
        <h1>Thank you</h1>
        <h3>
          We appreciate your order. We are a small, Canadian and veteran-owned
          business.
        </h3>
        <p>
          Please fill out and send the form below when shipping the product.
        </p>
        <a href="" className={styles.button1}>
          Download
        </a>
        <a href="/" className={styles.button2}>
          Home
        </a>
      </div>
    </div>
  </section>
);

export default ThankYou;
