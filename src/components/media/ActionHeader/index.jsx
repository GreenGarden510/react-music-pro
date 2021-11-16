import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { addFavorite, removeFavorite } from '$redux/features/user';
import { showModal } from '$redux/features/modal';

import styles from './index.module.scss';

const favoriteActive = require('$assets/images/icons/favorite-active.svg');
const favorite = require('$assets/images/icons/favorite.svg');
const share = require('$assets/images/icons/share.svg');
const menu = require('$assets/images/icons/menu.svg');
const playlist = require('$assets/images/icons/playlist.svg');

const ActionHeader = (props) => {
  // props
  const {
    mediaId,
    title,
    avatarUrl,
    country,
    showPlaylist,
  } = props;
 
  // store
  const dispatch = useDispatch();
  const favourites = useSelector((store) => store.authentication.user.favourites);

  // state
  const [isFavorite, setIsFavorite] = useState(false);

  // effects
  useEffect(() => {
    if (!favourites) { return; }

    const res = favourites.find((media) => media.media_id === mediaId);
    if (!res) {
      setIsFavorite(false);
      return;
    }
    setIsFavorite(true);
  }, [favourites]);

  // handlers
  const handleFavorite = () => {
    const data = {
      media_id: mediaId,
    };

    if (!isFavorite) {
      dispatch(addFavorite(data));
    } else {
      dispatch(removeFavorite(data));
    }
    setIsFavorite(!isFavorite);
  }

  const playListMenu = () => {
    dispatch(showModal('PLAYLIST_MODAL', {
      mediaId,
      title,
    }));
  }

  const handleShare = () => {
    dispatch(showModal('SHARE_MODAL', {
      title,
      country,
      id: mediaId,
      avatarUrl,
    }));
  }

  // render
  return (
    <div className="d-flex ml-auto">
      {
        showPlaylist && (
          <button
            className={styles.featurePlayBtn}
            onClick={playListMenu}
          >
            <img
              src={playlist}
              className={styles.playlistIcon}
            />
          </button>
        )
      }
      <button
        className={styles.featurePlayBtn}
        onClick={handleFavorite}
      >
        <img
          src={isFavorite ? favoriteActive : favorite}
          className=""
        />
      </button>
      <button
        className={styles.featurePlayBtn}
        onClick={handleShare}
      >
        <img
          src={share}
          className=""
        />
      </button>
    </div>
  );
}
ActionHeader.defaultProps = {
  showPlaylist: false,
}

ActionHeader.propTypes = {
  showPlaylist: PropTypes.bool,
}

export default ActionHeader;
