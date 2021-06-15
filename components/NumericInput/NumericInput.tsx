import React from 'react';
import styles from './NumericInput.module.scss';

interface NumericInputProps {
  text: string;
}

const NumericInput: React.FC<NumericInputProps> = ({ text }) => (
  <>
    <p>{text}</p>
    <label className={styles.inputLabel}>
      <input type="text" pattern="[0-9]*" min={0} placeholder="Quantity" />
    </label>
  </>
);

export default NumericInput;
