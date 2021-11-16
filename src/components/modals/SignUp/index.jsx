import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import Alert from '$components/authentication/Alert';
import Button from '$components/common/Button';
import TextInput from '$components/common/TextInput';
import InfoPane from '$components/authentication/Info';
import InputField from '$components/forms/InputField';
import FacebookSignUpButton from '$components/modals/SignUp/FacebookSignUpButton/index'
import GoogleLoginComponent from '$components/modals/GoogleLoginComponent';
import FacebookLoginComponent from '$components/modals/FacebookLoginComponent';
import { showModal, hideModal } from '$redux/features/modal';
import { signup } from '$redux/features/authentication';

import { routePaths } from '$common/routeConfig';

import './index.scss';
import { COLOR_ACCENT, COLOR_PRIMARY } from '../../../common/constants';

const background = require('$assets/images/login_bg.png');
const login_mobile_top = require('$assets/images/login_mobile_top.png');
const login_mobile_bottom = require('$assets/images/login_mobile_bottom.png');
const logo = require('$assets/images/logo.png');

const user_icon = require('$assets/images/icons/register_user.svg');
const music_icon = require('$assets/images/icons/register_music.svg');
const manager_icon = require('$assets/images/icons/register_manager.svg');
const user_icon_white = require('$assets/images/icons/register_user_active.svg');
const music_icon_white = require('$assets/images/icons/register_music_active.svg');
const manager_icon_white = require('$assets/images/icons/register_manager_active.svg');
const arrow_left = require('$assets/images/icons/arrow-left-home.svg');


const RegisterTopShape = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 70%;
    height: 20%;
    border-radius: 0 0 90% 0;
    background: linear-gradient(${COLOR_PRIMARY}, ${COLOR_ACCENT});
`;

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


const RegisterBack = styled.div`
  width: 100%;
  height: 0;
  background-size: cover;
  background-position: left;
  position: absolute;
  background-color: transparent;
  top: 0;
  left: 0;
  z-index: 1;
  @media screen and (max-width: 576px) {
    background-image: url(${login_mobile_top});
    padding-top: 39%
  }
  @media screen and (min-width: 576px) {
    background-image: url(${background});
    padding-top: 23%;
  }
`;

// const options = [
//   { value: 'user', label: 'User' },
//   { value: 'creator', label: 'Artist' },
//   { value: 'admin', label: 'Manager' },
// ];

const initialValues = {
  fullName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: 'user',
};


const SignupModal = () => {
  // state
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState(null);
  const [currentPage, setFirstPage] = useState(true);

  // store
  const dispatch = useDispatch();
  const history = useHistory();
  const signupError = useSelector((store) => store.authentication.signupError);
  const signUpComplete = useSelector((store) => store.authentication.signUpComplete);
  const signupPending = useSelector((store) => store.authentication.signupPending);

  useEffect(() => {
    // routePaths.onBoarding
    if (!signUpComplete) {
      return;
    }

    dispatch(hideModal()); // Should close on route change?
    history.replace(routePaths.onBoarding);
  }, [signUpComplete]);

  // handlers
  const handleChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleLogin = () => {
    dispatch(showModal('LOGIN_MODAL'));
  };

  const handleSignUp = () => {
    if (values.password !== values.confirmPassword) {
      setError('Passwords don\'t match');
      return;
    }

    let isValid = true;

    for (const value in values) {
      if (!values[value]) {
        console.log(values, values[value])
        isValid = false;
      }
    }

    if (!isValid) {
      setError('Please fill all fields to proceed.');
      return;
    }
    console.log({
      full_name: values.fullName,
      phone_number: values.phoneNumber,
      email: values.email,
      password: values.password,
      user_type: values.userType.value, // user, creator, admin
      country: 'TZ',
    });
    dispatch(signup({
      full_name: values.fullName,
      phone_number: values.phoneNumber,
      email: values.email,
      password: values.password,
      user_type: values.userType, // user, creator, admin
      country: 'TZ',
    }));
  };

  const handlePage = (index) => {
    if (index == 3 && (values.fullName == '' || values.email == '' || values.phoneNumber == '')) {
      setError('Please fill all fields to proceed.');
      return;
    }
    if (index == 4 && (values.password == '' || values.confirmPassword == '')) {
      setError('Please fill all fields to proceed.');
      if (values.password != values.confirmPassword) {
        setError('Passwords don\'t match');
      }
      setError(null);
      handleSignUp()
      return;
    }
    setError(null);
    setFirstPage(index);
  }

  // render
  return (
    <div className="row">
      <div className="col-lg-6 d-none d-md-block">
      <GradientBackground>
          <div className="d-flex flex-column justify-content-center align-items-center h-100">
            <h1 className="display-3 text-light pt-20 w-75">Register with Mkondo</h1>
            <div className="w-75 my-4">
              <div className="py-1 bg-light w-50 rounded-pill"></div>
            </div>
            <p className="lead w-75 text-light">Africa's choice for premium content. Listen, Watch and Enjoy more with Mkondo.</p>
          </div>
        </GradientBackground>
      </div>
      <div className="col-lg-6">
      <div className="d-sm-none"><RegisterTopShape /></div>
      <div className="d-flex flex-column h-100 justify-content-center align-items-center">
          <div className="w-75">
          <img src={logo} className="d-block ml-auto mb-5" alt="Mkondo Logo" height="75" />
              <div className="f25 mb-4">Register</div>
              {
                (error || signupError)
                && (
                  <Alert
                    content={error || "Failed to sign up. Try again"}
                    type="error"
                  />
                )
              }
              {currentPage == 1 &&
                (
                  <div className="mb-5">
                    <h5>Choose User Group</h5>
                    <div className="d-flex w-100">
                      {
                        values['userType'] == 'user' ? (
                          <button className="group-item item-active">
                            <img src={user_icon_white} className="w40" />
                            <div>User</div>
                          </button>
                        ) : (
                          <button className="group-item" onClick={() => handleChange('userType', 'user')}>
                            <img src={user_icon} className="w40" />
                            <div>User</div>
                          </button>
                        )
                      }
                      {
                        values['userType'] == 'creator' ? (
                          <button className="group-item item-active" >
                            <img src={music_icon_white} className="w40" />
                            <div>Artist</div>
                          </button>
                        ) : (
                          <button className="group-item" onClick={() => handleChange('userType', 'creator')}>
                            <img src={music_icon} className="w40" />
                            <div>Artist</div>
                          </button>
                        )
                      }
                      {
                        values['userType'] == 'admin' ? (
                          <button className="group-item item-active">
                            <img src={manager_icon_white} className="w40" />
                            <div>Manager</div>
                          </button>
                        ) : (
                          <button className="group-item" onClick={() => handleChange('userType', 'admin')}>
                            <img src={manager_icon} className="w40" />
                            <div>Manager</div>
                          </button>
                        )
                      }

                    </div>
                    <button
                      onClick={() => handlePage(2)}
                      className="btn btn-primary mt-2"
                    >
                      CONTINUE
                    </button>
                  </div>
                )}
              {currentPage == 2 && (
                <>
                  <label class="label">Full Name</label>
                  <TextInput
                    name="fullName"
                    placeholder="Fullname"
                    value={values.fullName}
                    onChange={handleChange}
                  />
                  <label class="label">Email</label>
                  <TextInput
                    name="email"
                    placeholder="Email Address"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                  <label class="label">Phone</label>
                  <TextInput
                    name="phoneNumber"
                    placeholder="Phone Number"
                    type="text"
                    value={values.phoneNumber}
                    onChange={handleChange}
                  />
                  <div className="d-flex mt-2 mb-2 align-items-center">
                    <button className="btn btn-primary mr-2"  onClick={() => handlePage(3)}>Register</button>
                    <button className="btn btn-outline-primary"  onClick={() => handlePage(1)}>Back</button>


                    <button className="gotoLogin" onClick={() => handleLogin()}>Already have an account?</button>
                  </div>
                  <GoogleLoginComponent />
                  <FacebookLoginComponent />

                </>
              )}
              {currentPage == 3 && (
                <>
                  <label class="label">Password</label>
                  <TextInput
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                  />
                  <label class="label">Confirm Password</label>
                  <TextInput
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    onClick={() => handlePage(2)}
                    className="btn btn-outline-primary mr-2"
                  >
                    Back
                    </button>
                  <button
                    onClick={() => handleSignUp()}
                    className="btn btn-primary"
                    disabled={signupPending}
                  >
                    Finish {signupPending ? <small>loading...</small> : null }
                  </button>
                  <div className="mb-5" style={{ clear: "both" }}></div>
                </>
              )
              }
            </div>
            </div>
      </div>
    </div>
  );
};

export default SignupModal;