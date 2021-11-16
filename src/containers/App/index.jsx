import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

import RouteWithSubRoutes from '$components/common/RouteWithSubRoutes';
import ModalRoot from '$components/modals/ModalRoot';
import Monitor from '$components/utility/Monitor';
import Player from '$components/utility/Player';

import NotFound from '$containers/NotFound';

import { setInitialNav, toggleIsMobile } from '$redux/features/nav';

import { routes, routePaths } from '$common/routeConfig';
import styles from './index.module.scss';
import LangBar from '../../components/common/LangBar';

const App = () => {
  // store
  const initialRoute = useSelector((store) => store.nav.initialRoute);
  const isMobile = useSelector((store) => store.nav.isMobile);
  const dispatch = useDispatch();

  // I18n initial setting
  const { t, i18n } = useTranslation('common');
  const [constructorHasRun, setConstructorHasRun] = useState(false);
  
  const constructor = () => {
    if (constructorHasRun) return;
    i18n.changeLanguage('en')
    setConstructorHasRun(true);
  };

  // handler
  const preventDefault = (evt) => {
    evt.preventDefault();
  }

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;

    return { width, height };
  }

  const handleResize = () => {
    const { width } = getWindowDimensions();
    if (width <= 576) {
      dispatch(toggleIsMobile(true));
      return;
    }
    dispatch(toggleIsMobile(false));
  }

  // effects
  useEffect(() => {
    constructor();

    window.addEventListener("dragover", preventDefault, false);
    window.addEventListener("drop", preventDefault, false);
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('dragover', preventDefault);
      window.removeEventListener('drop', preventDefault);
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (!initialRoute) {
      dispatch(setInitialNav(window.location.pathname));
    }
  }, [initialRoute]);

  // render
  if (!initialRoute) { // get the first url
    return null;
  }

  return (
    <Router>
      <ErrorBoundary
        FallbackComponent={NotFound}
      >
        <div className={styles.langBar}>
           <LangBar />
        </div>
        <Switch>
          {
            routes.map((route, i) => (
              <RouteWithSubRoutes
                key={`route-${i}`}
                {...route}
              />
            ))
          }
          <Redirect to={routePaths.notFound} />
        </Switch>
        <Monitor />
        <Player />
      </ErrorBoundary>
      <ModalRoot />
    </Router>
  );
};

export default App;
