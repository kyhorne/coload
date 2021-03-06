import React from 'react';
import Step from '../Step';
import styles from './Tutorial.module.scss';

interface TutorialListProps {
  tutorialRef: React.RefObject<HTMLDivElement>;
}

const Tutorial: React.FC<TutorialListProps> = ({ tutorialRef }) => (
  <section ref={tutorialRef} className={styles.tutorial}>
    <div className={`container ${styles.tutorialGrid}`}>
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
            "Ship the product to our storage facility – you'll receive an email confirmation once we receive and store the items."
          }
        />
        <Step
          title={'Act'}
          description={
            "Select items for return or sell them on our marketplace – we'll fulfil the shipment. You can also contact Coload at any time for additional support."
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
