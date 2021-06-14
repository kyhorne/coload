import React, { useRef } from 'react';
import Head from 'next/head';
import FeatureList from '../components/FeatureList';
import Hero from '../components/Hero';
import NavBar from '../components/NavBar';
import Tutorial from '../components/Tutorial';

const Home = () => {
  const featuresRef = useRef(null);
  const tutorialRef = useRef(null);

  return (
    <div>
      <Head>
        <title>Coload | TCG Storage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div
          style={{
            background: 'url(pokemon.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <NavBar featuresRef={featuresRef} tutorialRef={tutorialRef} />
          <Hero />
        </div>
        <FeatureList featuresRef={featuresRef} />
        <Tutorial tutorialRef={tutorialRef} />
      </main>
      <footer />
    </div>
  );
};

export default Home;
