import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '$components/common/Button';
import HamburgerMenu from '$components/nav/HamburgerMenu';

import { showModal } from '$redux/features/modal';
import { toggleSideMenu } from '$redux/features/nav';

import Menu from './Menu';

import styles from './index.module.scss';

import styled from 'styled-components';
const logo = require('$assets/images/logo.png');
const Logo = styled.div`
  background-image: url(${logo});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  height: 60px;
  width: 60px;
  @media screen and (max-width: 768px) {
    background-size: 45px 45px;
  }
`;

const Header = () => {
  // state
  const [activeMenu, setActiveMenu] = useState('about');
  const isSideMenuOpen = useSelector((store) => store.nav.isSideMenuOpen);

  // store
  const dispatch = useDispatch();

  // handlers
  const handleClick = (value) => {
    if (isSideMenuOpen) {
      dispatch(toggleSideMenu(false));
    }
  
    if (value === 'login') {
      dispatch(showModal('LOGIN_MODAL'));
      return;
    }

    if (value === 'signup') {
      dispatch(showModal('SIGNUP_MODAL'));
      return;
    }

    setActiveMenu(value);
  };

  // render
  return (
    <div className={`d-flex ${styles.wrapper}`}>
      <div className="d-block d-sm-none">
        <HamburgerMenu />
      </div>
      <div className={`d-flex flex-column ${styles.menuMobile} ${isSideMenuOpen ? styles.menuActive : ''}`}>
        <Button
          onClick={() => handleClick('login')}
        >
          Login
        </Button>
        <div className="my-2"/>
        <Button
          onClick={() => handleClick('signup')}
        >
          Sign Up
        </Button>
      </div>
      <div className="container">
        <div className="row py-3">
        <div className={`d-none d-sm-flex`}>
        <Logo />
        <div className="mr-auto"></div>
        <Menu
          name="about"
          title="About"
          isActive={activeMenu === 'about'}
          onClick={handleClick}
        />
        <Menu
          name="login"
          title="Login"
          isActive={activeMenu === 'login'}
          onClick={handleClick}
        />
        <Menu
          name="signup"
          title="Sign Up"
          isActive={activeMenu === 'signup'}
          onClick={handleClick}
        />
      </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
