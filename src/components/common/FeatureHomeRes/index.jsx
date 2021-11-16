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
  background-size: cover;
  background-image: url(${props => props.source}); 
  background-repeat-y: repeat;
  // mix-blend-mode: multiply;
  border-radius: 10px;
  @media screen and (min-width: 768px) {
    height: 60%;
    min-height: 170px;
    width: 100%;
    margin: auto;
  }
  @media screen and (max-width: 767px) {
    position: absolute;
    top: 0;
    width: 20%;
    min-height: 50px;
    height: 70%;
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 20px;
  }
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

const FeatureHomeRes = (props) => {
  // props
  const {
    mediaId,
    mediaUrl,
    avatar,
    artistId,
    owner_name,
    title,
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

    // handleFetch('GET', `media/presigned-get-url?file_name=${source}`, null, token)
    //   .then((res) => {
    //     if (!isMounted.current) {
    //       return;
    //     }
    //     setSourceUrl(res.response);
    //   });
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
      artistName: owner_name,
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
    <div className={styles.fr_featureWrapper}>
      <FeatureBkg source={avatarUrl} />
      {
        showHeader && (
          <div className={`d-flex justify-content-between mt-2 ${styles.fr_featureHeaderWrapper}`}>
            <div className={`px-2 ${styles.fr_featureHeaderWrapperTitle}`}>{plays} views</div>
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
      <div className={`d-flex w-100 ${styles.fr_featurePane}`}>
        <div className={styles.fr_featureContentWrapper}>
          
          <div className={`d-flex flex-row align-items-center mt-1 ${styles.fr_like_comment}`}>
            <div className={`text-white-50 text-right ml-auto ${styles.fr_fontSize12}`}>{likes} {t('likes')}</div>
            <img onClick={handleLikes} src={isLikes ? icon_like_full : icon_like} className={`${styles.fr_bottom_icon} ${styles.fr_hoverCursor}`} alt="" />
            <img onClick={handleView} src={icon_comment} className={`${styles.fr_bottom_icon} ${styles.fr_hoverCursor}`} alt="" />
          </div>

          <div className="d-flex">
            <button
              className={styles.fr_featurePlayBtn}
              onClick={handlePlay} >
              <PlayBtn
                isLoading={isLoading && currentMediaId === mediaId}
                isPlaying={isPlaying && currentMediaId === mediaId}
              />
            </button>


            <div className={`d-flex flex-column ${styles.fr_featureSummary}`}>
              <div style={{ flex: 1 }}>
                <div className={styles.fr_hoverCursor} onClick={handleArtistView}>
                  {owner_name}
                </div>
                <div className={styles.fr_fontSize16}><b>{title}</b></div>
                <div className={styles.fr_description}>{description}</div>
              </div>


            </div>
          </div>
        </div>

      </div>
      <div className={`text-white-50 ${styles.fr_comment}`}>View all {comment_num} {t('comments')} </div>

    </div>

  )
}

FeatureHomeRes.defaultProps = {
  country: '',
  mediaId: null,
  artistId: null,
  mediaUrl: '',
  showHeader: true,
}

FeatureHomeRes.propTypes = {
  subtitle: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  mediaUrl: PropTypes.string,
  mediaId: PropTypes.string,
  country: PropTypes.string,
  artistId: PropTypes.string,
  showHeader: PropTypes.bool,
}

export default FeatureHomeRes;
