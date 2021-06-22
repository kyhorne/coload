import React from 'react';
import styles from './NumericInput.module.scss';

interface NumericInputProps {
  fieldName: string;
  placeHolder?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
}

const NumericInput: React.FC<NumericInputProps> = ({
  fieldName,
  placeHolder,
  handleBlur,
  handleChange,
  value,
}) => (
  <>
    <p>{fieldName}</p>
    <label className={styles.inputLabel}>
      <input
        onChange={handleChange}
        name={placeHolder ? fieldName.toLowerCase() : fieldName}
        onBlur={handleBlur}
        value={value}
        type="number"
        min={0}
        step={placeHolder && 0.01}
        placeholder={placeHolder || 'Quantity'}
      />
    </label>
  </>
);

export default NumericInput;
