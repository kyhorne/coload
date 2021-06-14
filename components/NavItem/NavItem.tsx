import React from 'react';

interface NavItemProps {
  link: string;
  text: string;
}

const NavItem: React.FC<NavItemProps> = ({ link, text }) => (
  <li>
    <a href={link}>{text}</a>
  </li>
);

export default NavItem;
