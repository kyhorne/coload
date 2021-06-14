import React from 'react';

interface NavItemProps {
  href?: string;
  text: string;
  scrollTo?: React.RefObject<HTMLDivElement>;
}

const NavItem: React.FC<NavItemProps> = ({ scrollTo, href, text }) => (
  <li>
    {scrollTo ? (
      <a onClick={() => scrollTo.current?.scrollIntoView()}>{text}</a>
    ) : (
      <a href={href}>{text}</a>
    )}
  </li>
);

export default NavItem;
