import React from 'react';
import styles from './Hero.module.scss';

const Hero = () => (
  <section className={`${styles.hero}`}>
    <div className="flex-end container">
      <div className={styles.heroCard}>
        <h1>Coload Inc.</h1>
        <p>
          A marketplace and secure, personalized storage for your collectable
          card game.
        </p>
        <a href="" className="btn">
          Subscribe Now
        </a>
      </div>
    </div>
  </section>
);

export default Hero;
