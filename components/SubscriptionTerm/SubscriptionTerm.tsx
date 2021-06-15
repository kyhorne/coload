import React from 'react';
import { Term } from '../SubscribeForm/SubscribeForm';
import styles from './SubscriptionTerm.module.scss';

interface SubscriptionTermProps {
  term: Term;
  isOn: boolean;
  updateTerm: (term: Term) => void;
}

const SubscriptionTerm: React.FC<SubscriptionTermProps> = ({
  updateTerm,
  isOn,
  term,
}) => (
  <a
    className={`${styles.subscriptionButton} my-1`}
    onClick={() => updateTerm(term)}
    style={{
      backgroundColor: isOn ? '#00ebc7' : 'transparent',
      color: isOn ? '#00214d' : '#fffffe',
    }}
  >
    {term}
  </a>
);

export default SubscriptionTerm;
