import React, { useRef } from 'react';
import Head from 'next/head';
import FeatureList from '../components/FeatureList';
import Hero from '../components/Hero';
import NavBar from '../components/NavBar';
import Tutorial from '../components/Tutorial';
import { useUser } from '@auth0/nextjs-auth0';
import Loading from '../components/Loading';
import SubscriptionForm from '../components/SubscriptionForm';
import Footer from '../components/Footer';
import { NextPage } from 'next';

const Home: NextPage = () => {
  const featuresRef = useRef(null);
  const tutorialRef = useRef(null);
  const subscribeRef = useRef(null);

  console.log(process.env.NODE_ENV);

  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

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
          <NavBar
            user={user}
            featuresRef={featuresRef}
            tutorialRef={tutorialRef}
            subscribeRef={subscribeRef}
          />
          <Hero subscribeRef={subscribeRef} />
        </div>
        <FeatureList featuresRef={featuresRef} />
        <Tutorial tutorialRef={tutorialRef} />
        <SubscriptionForm
          subscribeRef={subscribeRef}
          isLoggedIn={user !== undefined}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
