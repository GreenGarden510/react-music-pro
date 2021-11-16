import React from 'react';
import { useGoogleLogout } from 'react-google-login';

const clientId = "657373538887-r4cjugt1peefmmo8b5i6bharghg90eto.apps.googleusercontent.com"

const GoogleLogoutComponent = () => {
    const onLogoutSuccess = res => {
        alert('Logged out Successfully');
        console.log('[Logout]');
    };

    const onFailure = () => {
        console.log('Handle failure cases');
    }

    const { signOut } = useGoogleLogout({
        clientId, onLogoutSuccess, onFailure
    });

    return (
        <button onClick={signOut} className="btn btn-primary">
            <span className="">Google Sign Out</span>
        </button>
    );
}

export default GoogleLogoutComponent;