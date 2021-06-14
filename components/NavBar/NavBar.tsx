import React from 'react';
import { UserProfile } from '@auth0/nextjs-auth0';
import NavItem from '../NavItem';
import styles from './NavBar.module.scss';

interface NavBarProps {
  featuresRef: React.RefObject<HTMLDivElement>;
  tutorialRef: React.RefObject<HTMLDivElement>;
  user?: UserProfile;
}

const NavBar: React.FC<NavBarProps> = ({ featuresRef, tutorialRef, user }) => (
  <section className={styles.navbar}>
    <nav className="flex-end container">
      <ul>
        <NavItem scrollTo={featuresRef} text={'Features'} />
        <NavItem scrollTo={tutorialRef} text={'How Coload Works'} />

        {user ? (
          <NavItem href="/api/auth/logout" text={'Logout'} />
        ) : (
          <NavItem href="/api/auth/login" text={'Login'} />
        )}

        <NavItem href={'mailto:help@thecoload.com'} text={'Contact'} />
        <NavItem text={'Subscribe Now'} />
      </ul>
    </nav>
  </section>
);

export default NavBar;
