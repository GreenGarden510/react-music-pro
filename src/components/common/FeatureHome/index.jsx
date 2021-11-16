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
  flex-grow: 6;
  position: relative;
  min-height: 100px;
  width: 100%;
  margin: auto;
  background-size: cover;
  background-image: url(${props => props.source}); 
  background-repeat-y: repeat;
  // mix-blend-mode: multiply;
  border-radius: 10px;
`;

const PlayButton = styled.div`
  background-color: transparent;
  border: none;
  &:focus {
      outline: 0;
  }
  position: absolute;
  ${props => props.category == 'audio' && `
    right: 5px;
    bottom: 5px;
  `}
  ${props => ['video', 'movie', 'episode'].includes(props.category) && `
    left: 50%;
    margin-left: -20px;
    top: 50%;
    margin-top: -20px;
  `}
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

const FeatureHome = (props) => {
  // props
  const {
    avatar,
    source,
    owner_name,
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
  const user = useSelector((store) => store.authentication.user);
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
  const [isLiked, setIsLiked] = useState(likes && typeof likes.some == 'function' ? likes.some(like => like.user_id == user.user_id) : false);

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
    if (typeof likes.some == 'function' && likes.some((like) => like.user_id == user.user_id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    
  }, [likes]);

  // handlers
  const handlePlay = async () => {
    console.log("Handle Play Triggered");
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

    if (!isLiked) {
      dispatch(addLikes(data));
    } else {
      dispatch(removeLikes(data));
    }
    setIsLiked(!isLiked);
  }

  // render
  return (
    <div className={styles.f_featureWrapper}>
      <FeatureBkg source={avatarUrl}>
      {
        showHeader && (
          <>
            <div className={`d-flex align-items-center justify-content-between ${styles.f_featureHeaderWrapper}`}>
              <div className={`ml-3 ${styles.views}`}>{plays} views</div>
                <ActionHeader
                  mediaId={mediaId}
                  country={country}
                  title={title}
                  avatarUrl={avatarUrl}
                  showPlaylist
                />
            </div>
            <PlayButton
              category={category}
              onClick={handlePlay} >
              <PlayBtn
                size={category == "audio" ? "30" : "40"}
                isLoading={isLoading && currentMediaId === mediaId}
                isPlaying={isPlaying && currentMediaId === mediaId}
              />
            </PlayButton>
          </>
        )
      }
      </FeatureBkg>
      <div className={`d-flex flex-1 w-100 ${styles.f_featurePane}`}>
        <div className={styles.f_featureContentWrapper}>
          <div className="d-flex flex-row align-items-center mt-1">
            <div className={`text-white-50 text-right ml-auto ${styles.f_fontSize12}`}>{likes.length} {t('likes')}</div>
            <img onClick={handleLikes} src={isLiked ? icon_like_full : icon_like} className={`${styles.f_bottom_icon} ${styles.f_hoverCursor_icon}`} alt="" />
            <img onClick={handleView} src={icon_comment} className={`${styles.f_bottom_icon} ${styles.f_hoverCursor_icon}`} alt="" />
          </div>
          <div className="d-flex">
            <div className={`d-flex flex-column ${styles.f_featureSummary}`}>
              <div style={{flex: 1}}>
                <div className={styles.f_hoverCursor} onClick={handleArtistView}>
                  {owner_name}
                </div>
                <div className={styles.f_fontSize16}><b>{title}</b></div>
                <div className={styles.f_description}>{description}</div>
              </div>

              <div onClick={handleView} className={`text-white-50 mt-2 ${styles.f_fontSize10}`}>View all {comment_num} {t('comments')} </div>

            </div>

          </div>
          <div className="d-flex flex-row">
            <span className="ml-auto">
              {/* <div className={`text-white-50 ${styles.f_fontSize10}`}> {plays} {t('plays')} </div> */}
            </span>
            {/* <img onClick={handleLikes} src={isLiked ? icon_like_full : icon_like} className={`${styles.f_bottom_icon} ${styles.f_hoverCursor}`} alt="" /> */}
            {/* <img onClick={handleView} src={icon_comment} className={`${styles.f_bottom_icon} ${styles.f_hoverCursor}`} alt="" /> */}
          </div>

        </div>
      </div>
    </div>

  )
}

FeatureHome.defaultProps = {
  country: '',
  mediaId: null,
  artistId: null,
  mediaUrl: '',
  showHeader: true,
  subtitle: '',
  likes: [],
}

FeatureHome.propTypes = {
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  mediaUrl: PropTypes.string,
  mediaId: PropTypes.string,
  country: PropTypes.string,
  artistId: PropTypes.string,
  showHeader: PropTypes.bool,
  likes: PropTypes.array
}

export default FeatureHome;
