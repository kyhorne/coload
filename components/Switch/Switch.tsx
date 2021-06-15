import React from 'react';
import styles from './Switch.module.scss';

const Switch = () => (
  <>
    <p>Sealed</p>
    <label className={styles.switch}>
      <input type="checkbox" />
      <span className={`${styles.slider} ${styles.round}`} />
    </label>
  </>
);

export default Switch;
