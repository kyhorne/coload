import React from 'react';
import { Term } from '../../util/products';
import styles from './SubscriptionTerm.module.scss';

interface SubscriptionTermProps {
  term: Term;
  isOn: boolean;
  setTerm: (term: Term) => void;
}

const SubscriptionTerm: React.FC<SubscriptionTermProps> = ({
  setTerm,
  isOn,
  term,
}) => (
  <a
    className={`${styles.subscriptionButton} my-1`}
    onClick={() => setTerm(term)}
    style={{
      backgroundColor: isOn ? '#00ebc7' : 'transparent',
      color: isOn ? '#00214d' : '#fffffe',
    }}
  >
    {term}
  </a>
);

export default SubscriptionTerm;
