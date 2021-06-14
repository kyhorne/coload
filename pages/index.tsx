import React from 'react';
import Head from 'next/head';
import FeatureList from '../components/FeatureList';
import Hero from '../components/Hero';
import NavBar from '../components/NavBar';
import Tutorial from '../components/Tutorial';

const Home = () => (
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
        <NavBar />
        <Hero />
      </div>
      <FeatureList />
      <Tutorial />
    </main>
    <footer />
  </div>
);

export default Home;
