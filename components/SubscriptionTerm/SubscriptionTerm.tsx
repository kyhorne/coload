import React from 'react';
import styles from './SubscriptionTerm.module.scss';

interface SubscriptionTermProps {
  text: string;
  backgroundColor: string;
  color: string;
  updateTerm: () => void;
}

const SubscriptionTerm: React.FC<SubscriptionTermProps> = ({
  updateTerm,
  backgroundColor,
  color,
  text,
}) => (
  <a
    className={styles.subscriptionButton}
    onClick={updateTerm}
    style={{
      backgroundColor,
      color,
    }}
  >
    {text}
  </a>
);

export default SubscriptionTerm;
