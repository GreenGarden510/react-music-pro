import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, generatePath } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import ActionHeader from '$components/media/ActionHeader';
import PlayBtn from '$components/media/PlayBtn';
import { addLikes, removeLikes } from '$redux/features/user';

import { handleFetch } from '$common/requestUtils';
import { routePaths } from '$common/routeConfig';

import { loadMedia } from '$redux/features/player';

import styles from './index.module.scss';

const defaultAvatar = require('$assets/images/profile-user.svg');
const icon_like = require('$assets/images/icons/like.svg');
const icon_like_full = require('$assets/images/icons/like-full.svg');
const icon_comment = require('$assets/images/icons/comment.svg');

const commonStyle = `
  background-repeat: no-repeat;
  background-position: center;
`;

const FeatureBkg = styled.div`
  ${commonStyle}
  position: absolute;
  height: 100%;
  width: 100%;
  background-size: 100%;
  background-image: url(${props => props.source}); 
  background-repeat-y: repeat;
  mix-blend-mode: multiply;
`;

const FeatureAvatar = styled.div`
  ${commonStyle}
  height: 80px;
  width: 80px;
  border-radius: 40px;
  margin-right: 10px;
  background-size: cover;
  background-image: url(${props => props.source}); 
`;

const Feature = (props) => {
  // props
  const {
    avatar,
    source,
    subtitle,
    title,
    mediaUrl,
    mediaId,
    artistId,
    country,
    category,
    showHeader,
    description,

    likes,
    plays,
    comment_num
  } = props;

  // store
  const userToken = useSelector((store) => store.authentication.token);
  const visitorToken = useSelector((store) => store.authentication.visitorToken);
  const currentMediaId = useSelector((store) => store.player.currentMediaId);
  const isLoading = useSelector((store) => store.player.isLoading);
  const isPlaying = useSelector((store) => store.player.isPlaying);
  const likes_s = useSelector((store) => store.authentication.user.likes);

  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  // const source = useSelector((store) => store.authentication.user.avatar_url);

  const dispatch = useDispatch();
  const history = useHistory();

  const token = userToken || visitorToken;

  // state
  const [avatarUrl, setAvatarUrl] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isLikes, setIsLikes] = useState(false);

  // ref
  const isMounted = useRef(false);

  // effects
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    }
  }, []);

  useEffect(async () => {
    if (!token || !isMounted.current) {
      return;
    }

    handleFetch('GET', `media/presigned-get-url?file_name=${source}`, null, token)
      .then((res) => {
        if (!isMounted.current) {
          return;
        }
        setSourceUrl(res.response);
      });
    handleFetch('GET', `media/presigned-get-url?file_name=${avatar}`, null, token)
      .then((res) => {
        if (!isMounted.current) {
          return;
        }
        setAvatarUrl(res.response);
      });
  }, [token, avatar]);

  // effects
  useEffect(() => {
    if (!likes_s) { return; }
    const res = likes_s.find((media) => media.media_id === mediaId);
    if (!res) {
      return;
    }
    setIsLikes(true);
  }, [likes_s]);

  // handlers
  const handlePlay = async () => {
    if (category !== 'audio') {
      handleView();
      return;
    }

    dispatch(loadMedia({
      mediaId,
      url: mediaUrl,
      howl: null,
      avatar: avatarUrl,
      name: title,
      artistName: subtitle,
    }));
  }

  const handleView = () => {
    history.push(generatePath(routePaths.viewMedia, { id: mediaId }));
  }

  const handleArtistView = () => {
    history.push(generatePath(routePaths.viewArtist, { id: artistId }));
  }

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

  // render
  return (
    <div className={styles.wrapper}>
      <div className={styles.dummy}></div>
      <div className={styles.featureWrapper}>
        <FeatureBkg source={avatarUrl} />
        {
          showHeader && (
            <div className={`d-flex justify-content-between mt-2 px-2 ${styles.featureHeaderWrapper}`}>
              <div className={`px-2 ${styles.featureHeaderWrapperTitle}`}>{t('feature')} </div>
              <ActionHeader
                mediaId={mediaId}
                country={country}
                title={title}
                avatarUrl={avatarUrl}
                showPlaylist
              />
            </div>
          )
        }
        <div className={`d-flex w-100 ${styles.featurePane}`}>
          <div className={styles.featureContentWrapper}>
            <div className="d-flex">
              <div className={styles.hoverCursor} onClick={handleArtistView}>
                {
                  source ? (
                    <FeatureAvatar
                      source={sourceUrl}
                      className={styles.realFeatureAvater}
                      onClick={handleArtistView}
                    />
                  ) : (
                    <img
                      src={defaultAvatar}
                      className={styles.defaultFeatureAvatar}
                    />
                  )
                }
              </div>
              <button
                className={styles.featurePlayBtn}
                onClick={handlePlay} >
                <PlayBtn
                  isLoading={isLoading && currentMediaId === mediaId}
                  isPlaying={isPlaying && currentMediaId === mediaId}
                />
              </button>
              <div className={`d-flex flex-column ${styles.featureSummary}`}>
                <span className={styles.fontSize16}><b>{title}</b></span>
                <span className={styles.description}>{description}</span>
              </div>

            </div>
            <div className="d-flex flex-row">
              <span className="ml-auto">
                <div className={`text-white-50 text-right ${styles.fontSize12}`}><b>{likes} {t('likes')}</b></div>
                <div className={`text-white-50 ${styles.fontSize10}`}> {plays} {t('plays')} </div>
                <div className={`text-white-50 ${styles.fontSize10}`}> {comment_num} {t('comments')} </div>
              </span>
              <img onClick={handleLikes} src={isLikes ? icon_like_full : icon_like} className={`${styles.bottom_icon} ${styles.hoverCursor}`} alt="" />
              <img onClick={handleView} src={icon_comment} className={`${styles.bottom_icon} ${styles.hoverCursor}`} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

Feature.defaultProps = {
  country: '',
  mediaId: null,
  artistId: null,
  mediaUrl: '',
  showHeader: true,
}

Feature.propTypes = {
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  mediaUrl: PropTypes.string,
  mediaId: PropTypes.string,
  country: PropTypes.string,
  artistId: PropTypes.string,
  showHeader: PropTypes.bool,
}

export default Feature;
