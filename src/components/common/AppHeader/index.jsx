import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import { useGoogleLogout } from 'react-google-login';
import { useTranslation } from 'react-i18next';

import DropDown from '$components/common/DropDown';
import TextInputCustom from '$components/common/TextInputCustom';
import SearchResult from '$components/common/SearchResult';
import HamburgerMenu from '$components/nav/HamburgerMenu';

import { handleFetch } from '$common/requestUtils';
import { routePaths } from '$common/routeConfig';

import { logout } from '$redux/features/authentication';
import { hideModal } from '$redux/features/modal';
import { querySearch } from '$redux/features/nav';

import styles from './index.module.scss';

const defaultAvatar = require('$assets/images/profile-user.svg');
const dropdown = require('$assets/images/icons/dropdown.svg');
import { GOOGLE_CLIENT_ID } from '$common/constants';
const headerMenus = [
  { name: 'account', title: 'My Account', },
  { name: 'logout', title: 'Log Out', style: styles.optSecondary },
];

const AppHeader = (props) => {

  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  // props
  const { showSearch } = props;

  //state
  const [search, setSearch] = useState('');
  const [url, setUrl] = useState('');

  // store
  const userName = useSelector((store) => store.authentication.user.full_name);
  const avatar = useSelector((store) => store.authentication.user.avatar_url);
  const token = useSelector((store) => store.authentication.token);
  const modalActive = useSelector((store) => store.modal.type);
  const isMobile = useSelector((store) => store.nav.isMobile);
  const isSideMenuOpen = useSelector((store) => store.nav.isSideMenuOpen);
  const forceClearSearch = useSelector((store) => store.nav.forceClearSearch);
  const dispatch = useDispatch();
  const history = useHistory();

  // effects
  useEffect(async () => {
    if (!avatar) {
      return;
    }

    const res = await handleFetch('GET', `media/presigned-get-url?file_name=${avatar}`, null, token);
    setUrl(res.response);
  }, [avatar]);

  useEffect(() => {
    if (!forceClearSearch) {
      return;
    }

    setSearch('');
  }, [forceClearSearch]);

  // This remains same across renders
  // highlight-starts
  const debouncedSave = useRef(debounce(nextValue => dispatch(querySearch(nextValue)), 1000)).current;
  // highlight-ends

  // handler
  const handleChange = (name, value) => {
    setSearch(value);
    // Even though handleChange is created on each render and executed
    // it references the same debouncedSave that was created initially
    debouncedSave(value);
  }

  // Google Logout
  const onLogoutSuccess = res => console.log('[Google Logout Success]');
  const onFailure = res => console.log('[Google Logout Failure]');
  const { signOut } = useGoogleLogout({ clientId: GOOGLE_CLIENT_ID, onLogoutSuccess, onFailure });

  const handleSelect = (name) => {
    if (name === 'logout') {
      dispatch(logout());

      // Add google Logout
      signOut();
      return;
    }

    history.push(routePaths.profile);
  }

  const handleFocus = () => { // a hacky way to hideModal
    dispatch(hideModal());
  }

  const handleClear = () => {
    setSearch('');
  }

  // render
  return (
    <>
      <div className={`d-flex ${styles.appHeaderWrapper} ${modalActive ? styles.searchInactive : ''} ${isMobile ? styles.mobile : ''}`}>
        <div className={`d-flex align-items-center d-sm-none ${styles.menuWrapper}`}>
          <HamburgerMenu />
          {!isSideMenuOpen && <span className={styles.mobile_logo}>Mkondo</span>}
        </div>
        {
          showSearch && (
            <TextInputCustom
              name="search"
              placeholder={t('search')}
              value={search}
              onChange={handleChange}
              customWrapperClass={styles.appHeaderInput}
              icon={search ? "cancel" : "search"}
              onIconClick={handleClear}
              onFocus={handleFocus}
            />
          )
        }
        <DropDown
          options={headerMenus}
          handleSelect={handleSelect}
        >
          <div className={`d-flex align-items-center ${styles.appHeaderName}`}>
            <img
              src={url || defaultAvatar}
              className={styles.appHeaderAvatar}
              alt=""
            />
            <span className="d-none d-sm-block text-center">{userName || 'Name'}</span>
            <img src={dropdown} alt="" style={{width: '10px', marginRight: '5px'}} />
          </div>
        </DropDown>
      </div>
      {
        search && (
          <SearchResult />
        )
      }
    </>
  );
}

AppHeader.defaultProps = {
  showSearch: true,
}

AppHeader.propTypes = {
  showSearch: PropTypes.bool,
}

export default AppHeader;
