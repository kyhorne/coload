import React from 'react';
import styles from './Hero.module.scss';

interface HeroProps {
  subscribeRef: React.RefObject<HTMLDivElement>;
}

const Hero: React.FC<HeroProps> = ({ subscribeRef }) => (
  <section className={styles.hero}>
    <div className="flex-end container">
      <div className={styles.heroCard}>
        <h1>Coload Inc.</h1>
        <p>
          A marketplace and secure, personalized storage for your collectable
          card game.
        </p>
        <a
          onClick={() => subscribeRef.current?.scrollIntoView()}
          className="btn"
        >
          Subscribe Now
        </a>
      </div>
    </div>
  </section>
);

export default Hero;
