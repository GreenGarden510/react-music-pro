import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FacebookLogin from 'react-facebook-login';

import { login } from '$redux/features/authentication';

import Button from '$components/common/Button';
import styles from './index.module.scss';
const facebook_icon = require('$assets/images/icons/facebook-icon.svg');

import { FACEBOOK_APP_ID } from '$common/constants';


// const refreshTokenSetup = res => {
//     let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

//     const refreshToken = async () => {
//         const newAuthRes = await res.reloadAuthResponse();
//         refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
//         console.log("newAuthRes: ", newAuthRes);

//         // saveUserToken(newAuthRes.access_token);
//         console.log('new auth Token', newAuthRes.id_token);

//         // Setup the other timer after the first one
//         setTimeout(refreshToken, refreshTiming);
//     }
//     // Setup first refresh timer
//     setTimeout(refreshToken, refreshTiming)
// }

const FacebookLoginComponent = (props) => {

    const dispatch = useDispatch();
    const loginPending = useSelector((store) => store.authentication.loginPending);

    const responseFacebook = (res) => {
        dispatch(login({
            login_strategy: 'facebook',
            username: 'facebooklogin@email.com',
            password: '',
            tokenId: res.accessToken
        }))
    }

    const componentClicked = () => console.log("[Facebook Login Button Clicked]");

    return (
        <FacebookLogin
            appId={FACEBOOK_APP_ID}
            autoLoad={false}
            disableMobileRedirect={true}
            fields="name,email,picture"
            scope="public_profile,user_friends,user_actions.books,email"
            callback={responseFacebook}
            onClick={componentClicked}
            cssClass={`d-flex ${styles.mkBtn} ${styles.mkBtnStretch}`}
            icon={<img className="ml-0" src={facebook_icon} height="40" />}
        >Facebook</FacebookLogin>
    )
}

export default FacebookLoginComponent;