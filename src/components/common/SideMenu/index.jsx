import React from 'react';
import { NavLink, useHistory, generatePath } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from '$components/common/Button';

import { routePaths } from '$common/routeConfig';
import { getPermissions } from '$common/utils';

import { showModal } from '$redux/features/modal';

import styles from './index.module.scss';
import { useEffect } from 'react';

const playlistIcon = require('$assets/images/icons/playlist-icon.svg');
const logo = require('$assets/images/logo.png');

const SideMenu = (props) => {
  // store
  const history = useHistory();
  const dispatch = useDispatch();
  const userRole = useSelector((store) => store.authentication.user.user_type);
  const isPublished = useSelector((store) => store.authentication.user.publish);
  const playlists = useSelector((store) => store.playlist.playlists);
  
  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  // icons
  const artistIcons = [
    {
      icon: require('$assets/images/icons/add_user.svg'),
      activeIcon: require('$assets/images/icons/add_user.svg'),
      title: 'add_artist',
      path: routePaths.newArtist,
      permission: 'admin',
    },
    {
      icon: require('$assets/images/icons/bar_chart.svg'),
      activeIcon: require('$assets/images/icons/bar_chart.svg'),
      title: 'insights',
      path: routePaths.insights,
      permission: 'media',
    },
    {
      icon: require('$assets/images/icons/upload.svg'),
      activeIcon: require('$assets/images/icons/upload.svg'),
      title: 'upload_media',
      path: routePaths.newMediaCategory,
      permission: 'artist',
    },
    {
      icon: require('$assets/images/icons/series.svg'),
      activeIcon: require('$assets/images/icons/series.svg'),
      title: 'My Series',
      path: routePaths.mySeries,
      permission: 'artist',
    },
    {
      icon: require('$assets/images/icons/upload.svg'),
      activeIcon: require('$assets/images/icons/upload.svg'),
      title: 'Manager Panel',
      path: routePaths.managerPanel,
      permission: 'artist',
    },
  ];


  const userIcons = [
    {
      icon: require('$assets/images/icons/favorite.svg'),
      activeIcon: require('$assets/images/icons/favorite.svg'),
      title: 'favorites',
      path: routePaths.favorites,
    },
    {
      icon: require('$assets/images/icons/history_side.svg'),
      activeIcon: require('$assets/images/icons/history_side.svg'),
      title: 'history',
      path: routePaths.history,
    },
  ];

  const icons = [
    {
      icon: require('$assets/images/icons/home_side.svg'),
      activeIcon: require('$assets/images/icons/home_side.svg'),
      title: 'home',
      path: routePaths.home,
    },
    {
      icon: require('$assets/images/icons/radio_signal.svg'),
      activeIcon: require('$assets/images/icons/radio_signal.svg'),
      title: 'recommendation',
      path: routePaths.recommendation,
    },
    {
      icon: require('$assets/images/icons/star.svg'),
      activeIcon: require('$assets/images/icons/star.svg'),
      title: 'new_release',
      path: routePaths.newRelease,
    },
    {
      icon: require('$assets/images/icons/top-chart.svg'),
      activeIcon: require('$assets/images/icons/top-chart.svg'),
      title: 'top_chart',
      path: routePaths.topChart,
    },
  ];

  const setupRoutes = [
    {
      icon: require('$assets/images/icons/top-chart.svg'),
      activeIcon: require('$assets/images/icons/top-chart-active.svg'),
      title: 'slider',
      path: routePaths.slider,
      permission: 'super admin',
    },
    {
      icon: require('$assets/images/icons/top-chart.svg'),
      activeIcon: require('$assets/images/icons/top-chart-active.svg'),
      title: 'settings',
      path: routePaths.configurations,
      permission: 'super admin',
    },
  ]

  const artistAccess = getPermissions('artist', userRole);
  const adminAccess = getPermissions('super admin', userRole);

  // handlers
  const handleNewPlaylist = () => {
    dispatch(showModal('PLAYLIST_MODAL'));
  }

  // render
  return (
    <div className={styles.sideMenu}>
      <div className={`text-center ${styles.logoWrapper}`}>
        <img src={logo} alt="" className={styles.sidemenu_logo} />
      </div>
      <div className={`d-flex flex-column ${styles.sideMenusWrapper}`}>
        <span onClick={() => history.push(routePaths.socialmedia)} className={`${styles.socialButton}`}><span>Switch to <br/></span> Mkondo Social</span>
        <p className={styles.sideMenuSubtitle}>{t('browse')}</p>
        {
          icons.map((item, idx) => (
            <NavLink
              to={item.path}
              className={styles.sideMenuItem}
              activeClassName={styles.sideMenuItemTitle}
              key={`sidemenu-${idx}`}
            >
              <img
                src={history.location.pathname === item.path ? item.activeIcon : item.icon}
                className={styles.sideMenuItemIcon}
              />
              <span>{t(item.title)}</span>
            </NavLink>
          ))
        }
        <div className={`d-flex flex-column artist-menus ${styles.artistMenus}`}>
          <p className={styles.sideMenuSubtitle}>{t('your_activity')}</p>
          {
            userIcons.map((item, idx) => {
              const canAccess = !item.permission ? true : getPermissions(item.permission, userRole);
              if (!canAccess) {
                return null;
              }

              return (
                <NavLink
                  to={item.path}
                  className={styles.sideMenuItem}
                  activeClassName={styles.sideMenuItemTitle}
                  key={`sidemenu-${idx}`}
                >
                  <img
                    src={history.location.pathname === item.path ? item.activeIcon : item.icon}
                    className={styles.sideMenuItemIcon}
                  />
                  <span>{t(item.title)}</span>
                </NavLink>
              )
            })
          }
        </div>
        {
          artistAccess && (
            <div className={`d-flex flex-column artist-menus ${styles.artistMenus}`}>
              <p className={styles.sideMenuSubtitle}>{t('artist_panel')}</p>
              {
                artistIcons.map((item, idx) => {
                  const canAccess = !item.permission ? true : getPermissions(item.permission, userRole, { isPublished });
                  if (!canAccess) {
                    return null;
                  }

                  return (
                    <NavLink
                      to={item.path}
                      className={styles.sideMenuItem}
                      activeClassName={styles.sideMenuItemTitle}
                      key={`sidemenu-${idx}`}
                    >
                      {
                        <img
                          src={history.location.pathname === item.path ? item.activeIcon : item.icon}
                          className={styles.sideMenuItemIcon}
                        />
                      }
                      <span>{t(item.title)}</span>
                    </NavLink>
                  )
                })
              }
            </div>
          )
        }
        {
          adminAccess && (
            <div className={`d-flex flex-column artist-menus ${styles.artistMenus}`}>
              <p className={styles.sideMenuSubtitle}>{t('admin')}</p>
              {
                setupRoutes.map((item, idx) => {
                  const canAccess = !item.permission ? true : getPermissions(item.permission, userRole);
                  if (!canAccess) {
                    return null;
                  }

                  return (
                    <NavLink
                      to={item.path}
                      className={styles.sideMenuItem}
                      activeClassName={styles.sideMenuItemTitle}
                      key={`sidemenu-${idx}`}
                    >
                      <img
                        src={history.location.pathname === item.path ? item.activeIcon : item.icon}
                        className={styles.sideMenuItemIcon}
                      />
                      <span>{t(item.title)}</span>
                    </NavLink>
                  )
                })
              }
            </div>
          )
        }
        <div className={`d-flex flex-column artist-menus ${styles.artistMenus}`}>
          <p className={styles.sideMenuSubtitle}>{t('your_playlists')}</p>
          <div className="m-4 ">
            <Button
              onClick={handleNewPlaylist}
              isSecondary
            >
              {t('new_playlist')}
          </Button>
          </div>
          {
            playlists.map((item, idx) => (
              <NavLink
                key={`side-menu-playlist-${idx}`}
                to={generatePath(routePaths.playlist, { id: item.playlist_id })}
                className={styles.sideMenuItem}
                activeClassName="active"
                key={`sidemenu-playlist-${idx}`}
              >
                <img
                  src={playlistIcon}
                  className={styles.sideMenuItemIcon}
                />
                <span>{item.name}</span>
              </NavLink>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default SideMenu;
