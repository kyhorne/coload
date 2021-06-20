import React from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { UserProvider } from '@auth0/nextjs-auth0';
import config from '../src/aws-exports';
import Amplify from 'aws-amplify';

Amplify.configure({ ...config, ssr: true });

const MyApp = ({ Component, pageProps }: AppProps) => (
  <UserProvider>
    <Component {...pageProps} />
  </UserProvider>
);

export default MyApp;
