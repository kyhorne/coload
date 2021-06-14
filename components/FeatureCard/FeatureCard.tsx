import React from 'react';
import styles from './FeatureCard.module.scss';

interface FeatureCardProps {
  title: string;
  image: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  image,
  description,
}) => (
  <div className={styles.featureCard}>
    <div className={styles.contents}>
      <div className={image} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </div>
);

export default FeatureCard;
