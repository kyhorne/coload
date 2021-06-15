import React from 'react';
import styles from './Switch.module.scss';

interface SwitchProps {
  toggle: () => void;
}

const Switch: React.FC<SwitchProps> = ({ toggle }) => (
  <>
    <p>Sealed</p>
    <label className={styles.switch}>
      <input type="checkbox" onClick={toggle} />
      <span className={`${styles.slider} ${styles.round}`} />
    </label>
  </>
);

export default Switch;
