import React from 'react';
import FeatureCard from '../FeatureCard';

const FeatureList = () => {
  return (
    <section id="features" className="features">
      <div className="container">
        <h3 className="text-center">
          Goodbye, overpriced safety deposit boxes.
        </h3>
        <div className="grid my-4">
          <FeatureCard
            title={'Storage'}
            image={'icons8-trolley'}
            description={
              'We offer subscription-based, personalized storage options for raw, sealed and slabbed trading card products.'
            }
          />
          <FeatureCard
            title={'Secure'}
            image={'icons8-favorites-shield'}
            description={
              'Our 24/7 surveilled, light and temperature-controlled facility protects from theft, fires, floods, and natural disasters.'
            }
          />
          <FeatureCard
            title={'Marketplace (Coming Soon)'}
            image={'icons8-price-tag'}
            description={
              'Infrastructure to buy or sell without the overhead of finding a merchant, storing, or shipping the product.'
            }
          />
        </div>
      </div>
    </section>
  );
};

export default FeatureList;
