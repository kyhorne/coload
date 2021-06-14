import React from 'react';

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
  <div className="feature">
    <h3>{title}</h3>
    <div className={`${image} feature-icon`}></div>
    <p>{description}</p>
  </div>
);

export default FeatureCard;
