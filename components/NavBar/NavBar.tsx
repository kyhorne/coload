import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import NavItem from '../NavItem';

const NavBar = () => {
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
          <NavItem link={'#features'} text={'Features'} />
          <NavItem link={'#tutorial'} text={'How Coload Works'} />

          {user ? (
            <NavItem link="/api/auth/logout" text={'Logout'} />
          ) : (
            <NavItem link="/api/auth/login" text={'Login'} />
          )}

          <NavItem link={'mailto:help@thecoload.com'} text={'Contact'} />
          <NavItem link={''} text={'Subscribe Now'} />
        </ul>
      </nav>
    </section>
  );
};

export default NavBar;
