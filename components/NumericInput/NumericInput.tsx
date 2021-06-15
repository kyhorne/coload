import React, { useState } from 'react';
import styles from './NumericInput.module.scss';

interface NumericInputProps {
  fieldName: string;
  placeHolder?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const NumericInput: React.FC<NumericInputProps> = ({
  fieldName,
  placeHolder,
  handleChange,
  value,
}) => (
  <>
    <p>{fieldName}</p>
    <label className={styles.inputLabel}>
      <input
        onChange={handleChange}
        name={fieldName.toLowerCase()}
        value={value}
        type="number"
        min={0}
        max={1000}
        step={placeHolder && 0.01}
        placeholder={placeHolder || 'Quantity'}
      />
    </label>
  </>
);

export default NumericInput;