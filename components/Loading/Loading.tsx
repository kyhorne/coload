import React from 'react';
import Spinner from '../Spinner';
import styles from './Loading.module.scss';

const Loading = () => (
  <div className={`${styles.loading} container`}>
    <Spinner />
    <h1>Loading Coload Inc.</h1>
  </div>
);

export default Loading;
