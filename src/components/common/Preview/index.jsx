import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, generatePath } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ActionHeader from '$components/media/ActionHeader';

import { routePaths } from '$common/routeConfig';
import { handleFetch } from '$common/requestUtils';

import { addLikes, removeLikes } from '$redux/features/user';

import styles from './index.module.scss';
import { useTranslation } from 'react-i18next';

const playBtn = require('$assets/images/icons/play.svg');
const defaultAvatar = require('$assets/images/profile-user-video.svg');
const icon_like = require('$assets/images/icons/like-video.svg');
const icon_like_full = require('$assets/images/icons/like-full.svg');
const icon_comment = require('$assets/images/icons/comment-video.svg');

const PreviewBkg = styled.div`
  height: 100%;
  width: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  transition: transform 100ms ease-in-out;
  transform: scale(${props => props.isActive ? 1.3 : 1});
  transform-origin: center;
  background-image: url(${props => props.source});
  background-color: #514E4E;
`;

const FeatureAvatar = styled.div`
  background-repeat: no-repeat;
  background-position: center;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  margin-right: 10px;
  background-size: cover;
  background-image: url(${props => props.source}); 
`;

const Preview = (props) => {
  // props
  const {
    title,
    description,
    avatar,
    source,
    onClick,
    isAvatarLoaded,
    hideHeader,
    mediaId,
    artistId,

    likes,
    plays,
    comment_num
  } = props;

  // state
  const [isActive, setIsActive] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [isLikes, setIsLikes] = useState(false);

  // props
  const userToken = useSelector((store) => store.authentication.token);
  const visitorToken = useSelector((store) => store.authentication.visitorToken);
  const likes_s = useSelector((store) => store.authentication.user.likes);

  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  const history = useHistory();
  const dispatch = useDispatch();

  // const source = useSelector((store) => store.authentication.user.avatar_url);

  const token = userToken || visitorToken;

  // effects
  useEffect(async () => {
    if (!avatar) {
      return;
    }

    if (isAvatarLoaded) {
      setAvatarUrl(avatar)
      return;
    }

    // TODO: use stage to determine and update the relevant token
    const res = await handleFetch('GET', `media/presigned-get-url?file_name=${avatar}`, null, userToken || visitorToken);
    setAvatarUrl(res.response);

    // Source URL
    handleFetch('GET', `media/presigned-get-url?file_name=${source}`, null, token)
      .then((res) => {
        setSourceUrl(res.response);
      });

  }, [avatar]);

  // effects
  useEffect(() => {
    if (!likes_s) { return; }
    const res = likes_s.find((media) => media.media_id === mediaId);
    if (!res) {
      return;
    }
    setIsLikes(true);
  }, [likes_s]);

  // Likes
  const handleLikes = () => {
    const data = {
      media_id: mediaId,
    };

    if (!isLikes) {
      dispatch(addLikes(data));
    } else {
      dispatch(removeLikes(data));
    }
    setIsLikes(!isLikes);
  }

  // handler
  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const handleView = () => {
    history.push(generatePath(routePaths.viewMedia, { id: mediaId }));
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    history.push(generatePath(routePaths.viewMedia, { id: mediaId }));
  }

  const handleArtistView = () => {
    history.push(generatePath(routePaths.viewArtist, { id: artistId }));
  }

  // render
  return (
    <div className={styles.temp}>
      <div
        className={styles.previewBkgWrapper}
        onMouseEnter={handleFocus}
        onMouseLeave={handleBlur}
      >
        <PreviewBkg
          source={avatarUrl}
          isActive={isActive}
        />
        {
          !hideHeader && (
            <div className={styles.header}>
              <ActionHeader
                title={title}
                mediaId={mediaId}
                avatarUrl={avatarUrl}
                country={description}
                showPlaylist
              />
            </div>
          )
        }
        <button
          className={styles.previewActionBtn}
          onClick={handleClick}
        >
          <img
            className={styles.previewActionIcon}
            src={playBtn}
          />
        </button>
      </div>
      <div className="container">
        <div className={styles.featureContentWrapper}>

          <div>
            {
              title && <p className={`${styles.title} text-left`}>{title}</p>
            }
            {
              description && <p className={`${styles.description} text-left`}>{description}</p>
            }
          </div>
          <div className="d-flex flex-col">
            <div onClick={handleArtistView}>
              {
                source ? (
                  <FeatureAvatar
                    source={sourceUrl}
                    className={styles.realFeatureAvater}
                  />
                ) : (
                  <img
                    src={defaultAvatar}
                    className={styles.defaultFeatureAvatar}
                  />
                )
              }
            </div>
            <span className="ml-auto">
              <div className={`text-right ${styles.font12}`}><b>{likes} {t('likes')}</b></div>
              <div className={styles.font10}> {plays} {t('plays')}</div>
              <div className={styles.font10}> {comment_num} {t('comments')} </div>
            </span>
            <img onClick={handleLikes} src={isLikes ? icon_like_full : icon_like} className={styles.bottom_icon} alt="" />
            <img onClick={handleView} src={icon_comment} className={styles.bottom_icon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

Preview.defaultProps = {
  title: null,
  description: null,
  onClick: null,
  isAvatarLoaded: false,
  hideHeader: false,
  mediaId: null,
};

Preview.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func,
  isAvatarLoaded: PropTypes.bool,
  hideHeader: PropTypes.bool,
  mediaId: PropTypes.string,
};

export default Preview;
