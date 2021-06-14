import React from 'react';
import Step from '../Step';

interface TutorialListProps {
  tutorialRef: React.RefObject<HTMLDivElement>;
}

const Tutorial: React.FC<TutorialListProps> = ({ tutorialRef }) => (
  <section ref={tutorialRef} className="tutorial">
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
          title={'Hold'}
          description={
            'Once you’ve found the storage plan right for you, ship the product to our facility. You’ll receive confirmation that it has been tracked and stored and can view your items online.'
          }
        />
        <Step
          title={'Act'}
          description={
            'Select items for return or sell them on our marketplace – we’ll fulfil the shipment. You can also contact Coload at any time for additional support.'
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
