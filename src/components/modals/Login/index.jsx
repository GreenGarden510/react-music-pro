import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import Button from '$components/common/Button';
import TextInput from '$components/common/TextInput';
import InfoPane from '$components/authentication/Info';
import Alert from '$components/authentication/Alert';
import GoogleLoginComponent from '$components/modals/GoogleLoginComponent';
import FacebookLoginComponent from '$components/modals/FacebookLoginComponent';

import { showModal, hideModal } from '$redux/features/modal';
import { login } from '$redux/features/authentication';

import { routePaths } from '$common/routeConfig';

import './index.scss';
import { COLOR_ACCENT, COLOR_PRIMARY } from '../../../common/constants';

const login_banner_top_hd = require('$assets/images/banner-login-top.png');
const login_mobile_top = require('$assets/images/login_mobile_top.png');
const login_mobile_bottom = require('$assets/images/login_mobile_bottom.png');
const logo = require('$assets/images/logo.png');
const arrow_left = require('$assets/images/icons/arrow-left-home.svg');


const GradientBackground = styled.div`
  width: 100%;
  height: 100%;
  background-image: linear-gradient(${COLOR_PRIMARY}, ${COLOR_ACCENT});
`;

const LoginBackBottom = styled.div`
  @media screen and (max-width: 576px) {
    width: 100%;
    height: 0;
    padding-top: 21%;
    background-size: cover;
    background-position: left;
    position: absolute;
    bottom: 0;
    left: 0;
    background-image: url(${login_mobile_bottom});
  }
`;

const LoginBack = styled.div`
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: top;
  background-repeat: no-repeat;
  position: absolute;
  background-color: transparent;
  z-index: 0;

  @media screen and (max-width: 576px) {
    background-image: url(${login_mobile_top});
  }
  @media screen and (min-width: 576px) {
    background-image: url(${login_banner_top_hd});
  }
`;

const initialValues = {
  email: '',
  password: '',
};

const LoginModal = () => {
  // state
  const [values, setValues] = useState(initialValues);

  // store
  const dispatch = useDispatch();
  const history = useHistory();
  const loginPending = useSelector((store) => store.authentication.loginPending);
  const error = useSelector((store) => store.authentication.loginError);
  const token = useSelector((store) => store.authentication.token);

  // effects
  useEffect(() => {
    if (token) {
      history.push(routePaths.home);
      return;
    }

    history.push(routePaths.marketing);
  }, [token]);

  // handlers
  const handleChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleForgotPassword = () => { dispatch(showModal('FORGOT_PASSWORD_MODAL')); };

  const handleSignUp = () => { dispatch(showModal('SIGNUP_MODAL')); };

  const handleSignIn = () => {
    const { email, password } = values;
    dispatch(login({
      login_strategy: 'local',
      username: email,
      password,
      tokenId: null
    }));
  };

  // render
  return (
    <div className="row">
      <div className="col-lg-6 d-none d-md-block">
        <GradientBackground>
          <div className="d-flex flex-column justify-content-center align-items-center h-100">
            <h1 className="display-3 text-light pt-20 w-75">Welcome back to mkondo</h1>
            <div className="w-75 my-4">
              <div className="py-1 bg-light w-50 rounded-pill"></div>
            </div>
            <p className="lead w-75 text-light">Sign in to continue to your account.</p>
          </div>
        </GradientBackground>
      </div>
      
      <div className="col-lg-6">
        <div id="login-mobile-top-shape" className="d-sm-none"></div>
        <div className="d-flex flex-column h-100 justify-content-center align-items-center">
          <div className="w-75">
          <img src={logo} className="d-block ml-auto mb-5" alt="Mkondo Logo" height="75" />
          <div className="f25 mb-4">Login</div>
              {
                error && (
                  <Alert
                    content={error}
                    type="error"
                  />
                )
              }
              <label class="label">Email</label>
              <TextInput
                name="email"
                placeholder="Email Address / User Name"
                value={values.email}
                onChange={handleChange}
              />
              <label class="label">Password</label>
              <TextInput
                name="password"
                placeholder="Password"
                type="password"
                value={values.password}
                onChange={handleChange}
              />
              <div className="d-flex align-items-center my-2 mt-4">
                <button
                  onClick={handleSignIn}
                  isLoading={loginPending}
                  className="btn btn-primary mr-2"
                >
                  {loginPending ? <span className="spinner-border w20"></span> : <span>LOGIN</span>}
                </button>
                <button
                  onClick={handleSignUp}
                  className="btn btn-outline-primary"
                >
                  REGISTER
                </button>
                <button
                  className="btn btn-link ml-auto"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="mt-4">
                <GoogleLoginComponent />
              </div>
              <div className="mt-4">
                <FacebookLoginComponent />
              </div>
              <div className="d-flex justify-content-center my-2">

              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
