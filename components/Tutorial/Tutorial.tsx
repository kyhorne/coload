import React from 'react';
import Step from '../Step';

const Tutorial = () => (
  <section className="tutorial" id="tutorial">
    <div className="container tut-grid">
      <h3>How Coload Works</h3>
      <ol>
        <Step
          title={'Browse'}
          description={
            'Start by exploring our storage options and select a plan based on your needs.'
          }
        />
        <Step
          title={'Ship'}
          description={
            'Once you’ve found what you’re looking for, ship the product to our storage facility. You will receive confirmation once it has been tracked and stored.'
          }
        />
        <Step
          title={'Act'}
          description={
            'Select items for return or sell them on our marketplace – we will fulfil the shipment. You can also contact Coload at any time for additional support.'
          }
        />
      </ol>
      <img
        style={{
          position: 'static',
          objectFit: 'contain',
          maxHeight: 500,
        }}
        src="pokemon-set.png"
      />
    </div>
  </section>
);

export default Tutorial;
