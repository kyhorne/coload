import React from 'react';
import styles from './SubscribeForm.module.scss';

interface SubscribeFormProps {
  subscribeRef: React.RefObject<HTMLDivElement>;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({ subscribeRef }) => (
  <div ref={subscribeRef} className={styles.form} />
);

export default SubscribeForm;
