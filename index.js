import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'regenerator-runtime/runtime'

import store from './src/redux/store';
import App from './src/containers/App';

import { I18nextProvider } from 'react-i18next'
import i18n from './src/i18n/i18n';

ReactDOM.render( 
	<I18nextProvider i18n = { i18n } >
	    <Provider store = { store } >
	    	<App / >
	    </Provider> 
    </I18nextProvider>,
    document.getElementById('root')
);