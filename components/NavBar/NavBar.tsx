import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import NavItem from '../NavItem';

interface NavBarProps {
  featuresRef: React.RefObject<HTMLDivElement>;
  tutorialRef: React.RefObject<HTMLDivElement>;
}

const NavBar: React.FC<NavBarProps> = ({ featuresRef, tutorialRef }) => {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <section className="navbar container">
      <nav className="flex">
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
};

export default NavBar;
