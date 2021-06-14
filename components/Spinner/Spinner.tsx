import React from 'react';
import styles from './Spinner.module.scss';

const Spinner = () => (
  <img src={'/spinner.gif'} className={styles.spinner} alt="loading..." />
);

export default Spinner;
