import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import Button from '$components/common/Button';
import Header from '$components/common/Header';
import Hero from '$components/common/Hero';
import TabsMark from '$components/common/TabsMark';
import HowItWorks from '$components/marketing-site/HowItWorks';
import AppDownload from '$components/marketing-site/AppDownload';
import Social from '$components/common/Social';
import TopPreview from '$components/marketing-site/TopPreview';

import { routePaths } from '$common/routeConfig';
import { getCurrentYear } from '$common/utils';

import {
  coldstart,
  reloadUser,
  visitorColdStart,
} from '$redux/features/authentication';
import { setInitialNav } from '$redux/features/nav';
import { showModal } from '$redux/features/modal';
import { getHistory } from '$redux/features/user';
import { getNewReleases } from '$redux/features/media';

import styles from './index.module.scss';

const how_it = require('$assets/images/how_it_works.png');
const logo_icon = require('$assets/images/logo_icon.png');

const HowIt = styled.div`
  background-image: url(${how_it});
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 50px;
`;

const Marketing = () => {
  // state
  const [selected, setSelected] = useState('audio');

  // store
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const token = useSelector((store) => store.authentication.token);
  const visitorToken = useSelector((store) => store.authentication.visitorToken);
  const signUpComplete = useSelector((store) => store.authentication.signUpComplete);
  const initialRoute = useSelector((store) => store.nav.initialRoute);
  const userId = useSelector((store) => store.authentication.user.user_id);
  const userType = useSelector((store) => store.authentication.user.user_type);
  const newReleases = useSelector((store) => store.media.newReleases);
  const getNewReleasesPending = useSelector((store) => store.media.getNewReleasesPending);

  console.log('[media]', newReleases);


  // effects
  useEffect(() => {
    const { state } = location;
    if (state && state.token) {
      dispatch(setInitialNav(routePaths.home));
      dispatch(showModal('RESET_PASSWORD_MODAL', {
        token: state.token,
      }));
      return;
    }

    dispatch(coldstart());
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (signUpComplete) {
      return
    }

    dispatch(reloadUser(userId));
    dispatch(getHistory());
    history.replace((initialRoute !== routePaths.marketing && initialRoute) || routePaths.home);
  }, [token]);

  useEffect(() => {
    if (!visitorToken) {
      return;
    }

    dispatch(getNewReleases({
      category: 'audio',
      amount: 6,
    }));
  }, [visitorToken])

  useEffect(() => {
    if (userType === 'visitor') {
      dispatch(visitorColdStart());
    }
  }, [userType]);

  // handlers
  const handleSelect = (name) => {
    setSelected(name);
    if (newReleases[name].length < 1) {
      dispatch(getNewReleases({
        category: name,
        amount: 6,
      }));
    }
  }

  const handleFindMore = () => {
    console.log('find more!!');
  }

  // render
  return (
    <div className={styles.wrapper}>
      <div style={{backgroundColor: '#111'}}>
        <Header />
        <Hero />
      </div>

      <div className={`container-fluid h-100`}>
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-sm-11">
            <div className="row">
              <h1 className={`${styles.f72} col-sm-6 mt-4`}>New Releases</h1>
              <div className="col-sm-6 mt-4">
                <TabsMark
                  onSelect={handleSelect}
                  selected={selected}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-md-11">
            <div className={`row ${styles.tabContentWrapper}`}>
              <div className={`${selected === 'audio' ? '' : 'd-none'}`}>
                <TopPreview
                  values={newReleases.audio}
                  isLoading={getNewReleasesPending && newReleases.audio.length < 1}
                />
              </div>
              <div className={`${selected === 'video' ? '' : 'd-none'}`}>
                <TopPreview
                  values={newReleases.video}
                  isLoading={getNewReleasesPending && newReleases.video.length < 1}
                />
              </div>
              <div className={`${selected === 'movie' ? '' : 'd-none'}`}>
                <TopPreview
                  values={newReleases.movie}
                  isLoading={getNewReleasesPending && newReleases.movie.length < 1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <HowIt>
        <HowItWorks />
      </HowIt>
      <div className={`container-fluid h-100`}>
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-sm-11">
            <div className="row mt-5 mb-5">
              <div className="col-sm-9 mt-4">
                <h1 className={`${styles.f72}`}>Never Stop Listening</h1>
                <div className={styles.f23}>
                  Discover, stream, and share a constantly expanding mix of music from emerging and
                  major artists around the world.
              </div>
              </div>
              <div className="col-sm-3 text-center">
                <img src={logo_icon} alt="" className={styles.neverStopIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`container-fluid h-100`}>
        {/* <div className={`row justify-content-center align-items-center ${styles.appDownloadWrapper}`}>
          <div className="col-12">
            <div className={styles.appDownloadFooter} />
            <div className={styles.appDownloadContent1}>
              <div className={`col-12 col-sm-8 col-md-6 offset-sm-2 offset-md-3 ${styles.downloadWrapper}`}>
                <AppDownload />
              </div>
            </div>
          </div>
        </div>
        <div className={`row ${styles.neverStopPanel}`}>
          <div className="col-12 col-sm-8 col-md-6 offset-sm-2 offset-md-3">
            <p className={`text-white ${styles.panelHeader}`}>Never stop listening</p>
            <p className="text-white">Discover, stream, and share a constantly expanding mix of music from emerging and major artists around the world.</p>
            <Button
              onClick={handleFindMore}
              isBorderSecondary
              isTransparent
              isSquare
            >
              FIND OUT MORE
          </Button>
            <div className="d-none d-md-block">
              <img
                className={styles.artistPlaceholder}
                src={artists}
                alt=""
              />
            </div>
          </div>
        </div> */}
        <div className={`row justify-content-center text-center ${styles.thanksPanel}`}>
          <div className="col-12 col-sm-8 col-md-6">
            <p className={`${styles.panelHeader} ${styles.panelHeaderDark} ${styles.f40}`}>Contact with us</p>
            <p className={styles.f23}>Follow us on.</p>
            <div className={`d-flex flex-wrap justify-content-center ${styles.socialWrapper}`}>
              <Social
                links={{
                  fb: '#',
                  instagram: '#',
                  yt: '#',
                  twitter: '#',
                }}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className={`col-12 d-flex align-items-center justify-content-center ${styles.marketingFooter}`}>
            <p>Copyright &copy;{getCurrentYear()} Mkondo. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </div >

  );
};

export default Marketing;
