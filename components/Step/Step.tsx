import React from "react";

interface StepProps {
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ title, description }) => (
  <li>
    {title}
    <p>{description}</p>
  </li>
);

export default Step;
