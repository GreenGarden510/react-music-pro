import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import Button from '$components/common/Button';
import InputField from '$components/forms/InputField';
import Row from '$components/media/CommentRow';
import Tabs from '$components/common/Tabs';
import Player from '$components/media/IndividualPlayer';
import VideoPlayer from '$components/media/VideoPlayer';

import {
  addComment,
  getComment,
  getRecommended,
  getMedia,
  deleteComment,
} from '$redux/features/media';

import styles from './index.module.scss';
import media, { addMediaComment, getSimilar, removeCommentLike } from '../../../redux/features/media';
import { COLOR_PRIMARY, COLOR_ACCENT } from '$common/constants'
import { addHistory, addLikes, removeLikes } from '../../../redux/features/user';
import { formatDate, getMediaUrl } from '../../../common/utils';
import { SimilarMediaItem } from './similarMediaItem';
import { showModal } from '$redux/features/modal';
import styled from 'styled-components';

const options = [
  { name: 'comments', title: 'Comments' },
  { name: 'description', title: 'Description' },
];

const field = {
  name: 'comments',
  type: 'area',
  placeholder: 'Comments',
  title: '',
};

const Spacer = styled.div`
  height: ${(props) => props.height}px;
`;

const CommentHeader = styled.div`
  position: fixed;
  left: 0;
  top: ${(props) => props.height}px;
  width: 100%;
  z-index: 1;
  background: rgba(0,0,0,0.8);
`;

const ViewMedia = () => {
  // state
  const [selected, setSelected] = useState(options[0].name);
  const [value, setValue] = useState('');
  const [similarMediaCovers, setSimilarMediaCovers] = useState({})
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [spacing, setSpacing] = useState(0);
  const [showComments, setShowComments] = useState(false);

  // store
  const dispatch = useDispatch();
  const { id: mediaId } = useParams();

  const userId = useSelector((store) => store.authentication.user.user_id);
  const token = useSelector((store) => store.authentication.token);
  const addCommentPending = useSelector((store) => store.media.addCommentPending);
  const addCommentComplete = useSelector((store) => store.media.addCommentComplete);
  const addCommentLikeComplete = useSelector((store) => store.media.addCommentLikeComplete);
  const removeCommentLikeComplete = useSelector((store) => store.media.removeCommentLikeComplete);
  // const deleteCommentPending = useSelector((store) => store.media.deleteCommentPending);
  const deleteCommentComplete = useSelector((store) => store.media.deleteCommentComplete);
  const comments = useSelector((store) => store.media.comments);
  const currentMedia = useSelector((store) => store.media.currentMedia);
  const similarMedia = useSelector((store) => store.media.similarMedia);
  const similarMediaLoading = useSelector((store) => store.media.getSimilarPending);
  const isMobile = useSelector((store) => store.nav.isMobile);

  //ref
  const videoPlayerRef = useRef()

  useEffect(() => {
    if (!currentMedia) return;
    dispatch(addHistory({
      media_id: mediaId,
    }));
  }, []);

  // effects
  useEffect(() => {
    if (!mediaId) {
      return;
    }

    dispatch(getMedia(mediaId));
    dispatch(getComment(mediaId));
    dispatch(getRecommended(userId));
    dispatch(getSimilar(mediaId));
  }, [addCommentComplete, deleteCommentComplete, mediaId]);

  useEffect(() => {
    if (!mediaId) return;
    dispatch(getComment(mediaId));
  }, [addCommentLikeComplete, removeCommentLikeComplete])

  useEffect(() => {
    if (!currentMedia.likes) return;
    setLikesCount(currentMedia.likes.length);
    if (currentMedia.likes.some(like => like.user_id == userId)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [currentMedia.likes])

  useEffect(() => {
    if (!isMobile || !videoPlayerRef.current) return;
    const properties = videoPlayerRef.current.getBoundingClientRect();
    const { bottom } = properties;
    setSpacing(bottom);
  }, [isMobile, videoPlayerRef.current])
  // handlers
  const handleSelect = (item) => {
    setSelected(item);
  }

  const handleChange = (name, value) => {
    setValue(value);
  }

  const handleAddComment = () => {
    if(value == "") return;
    dispatch(addMediaComment({
      media_id: mediaId,
      user_id: userId,
      value,
    }));
  }

  const handleDeleteComment = (commentId) => {
    if(!confirm("Are you going to delete this item?")) return;
    dispatch(deleteComment(commentId));
  }

  const commentPane = (
    <div className={selected === 'comments' ? '' : 'd-none'}>
        <InputField
            field={{
              ...field,
              value,
            }}
            onChange={handleChange}
          />
          <Button
          onClick={handleAddComment}
          isLoading={addCommentPending}
          isCustom
          hideDefault={false}
          className="btn btn-primary"
        >
          Add
        </Button>
     
        <div className="mt-3">
        {
          comments.map((comment, idx) => (
            <Row
              key={`comment-row-${idx}`}
              name={comment.commenter_name}
              date={comment.modified}
              value={comment.value}
              avatarUrl={comment.avatar_user_url}
              comment_id={comment.comment_id}
              deleteComment={handleDeleteComment}
              no_of_replies={comment.no_of_replies}
              replies={comment.comments ?? []}
              likes={comment.likes || undefined}
            />
          ))
        }
        </div>
    </div>
  );

  const descriptionPane = (
    <div className={selected === 'description' ? '' : 'd-none'}>
      <div className={`${styles.descriptionWrapper} text-light`}>
        {currentMedia.description}
      </div>
    </div>
  );

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount(likesCount - 1);
      dispatch(removeLikes({
        media_id: currentMedia.media_id,
      }));
    } else {
      setIsLiked(true);
      setLikesCount(likesCount + 1);
      dispatch(addLikes({
        media_id: currentMedia.media_id,
      }));
    }
  }

  const handleShare = () => {
    dispatch(showModal('SHARE_MODAL', {
      title: currentMedia.name,
      country: currentMedia.description,
      id: currentMedia.media_id,
      avatarUrl: currentMedia.cover_url,
      isAvatarLoaded: false,
    }))
  }

  const handlePlaylist = () => {
    dispatch(showModal('PLAYLIST_MODAL', {
      mediaId: currentMedia.media_id,
      title: currentMedia.name,
    }));
  }

  if (!currentMedia.media_id) {
    return <p>Loading...</p>
  }
  // render
  return (
    <div className={styles.container}>
      {
        currentMedia.category === 'audio' ? (
          <Player
            mediaUrl={currentMedia.media_url}
            coverUrl={currentMedia.cover_url}
            avatarUrl={currentMedia.owner_avatar_url}
            title={currentMedia.name}
            artistName={currentMedia.owner_name}
            mediaId={currentMedia.media_id}
          />
        ) : (
          <div className="row">
            <div className="col-lg-9">
              <div ref={videoPlayerRef} className={`${styles.stickyPlayer}`}>
                <VideoPlayer
                    url={currentMedia.media_url}
                  />
              </div>
             {isMobile && <Spacer height={(spacing * 0.6)} />}
              {(!isMobile || !showComments) && (
                <div className={`mt-3 mb-2 mb-lg-5 ${styles.description}`}>
                  <h2 className="text-light">{currentMedia.name}</h2>
                  <span>{currentMedia.plays} views • {formatDate(currentMedia.release_date)}</span>
                  <div className="d-flex justify-content-lg-end mb-1 mt-2 mt-lg-0">
                    <div onClick={handleLike} className={`d-flex align-items-center mr-4 ${styles.likeWrapper}`}>
                      <img 
                        src={ isLiked 
                          ? require("$assets/images/icons/like-solid-pink.svg") 
                          : require("$assets/images/icons/like-solid.svg")} 
                        alt="" height="24" />
                      <span className="ml-2 text-light">{likesCount}</span>
                    </div>
                    <div onClick={handleShare} className={`d-flex align-items-center mr-4 ${styles.likeWrapper}`}>
                      <img src={require("$assets/images/icons/share.svg")} alt="" height="24" />
                      <span className="ml-2 text-light">SHARE</span>
                    </div>
                    <div onClick={handlePlaylist} className={`d-flex align-items-center mr-2 ${styles.likeWrapper}`}>
                      <img src={require("$assets/images/icons/playlist.svg")} alt="" height="24" />
                      <span className="ml-2 text-light">PLAYLIST</span>
                    </div>
                  </div>
                </div>
              )}
              {isMobile && !showComments && (
                <div onClick={() => setShowComments(true)} className={`mb-2 ${styles.commentsToggle}`}>
                  <p>{currentMedia.comments ? currentMedia.comments.length : 0} comments</p>
                </div>
              )}
              {isMobile && showComments && (
                <CommentHeader height={(spacing)} className="d-flex px-4 py-3">
                  <span>Comments</span>
                  <img onClick={() => setShowComments(false)} src={require("$assets/images/icons/close.svg")} className="ml-auto" height="15px" alt="" />
                </CommentHeader>
              )}
            </div>
            {(!isMobile || !showComments) && (
              <div className="col-lg-3">
                <h3 className="text-light">Similar Content</h3>
                {similarMediaLoading ? <p>Loading...</p> : null }
                { similarMedia.map((media) => <SimilarMediaItem media={media} />)}
              </div>
            )}
          </div>
        )
      }
      <div className="row mt-5">
        <div className="col-lg-9">
          {/* <Tabs
            options={options}
            onSelect={handleSelect}
            selected={selected}
            name="viewMedia"
            activeColor={ COLOR_ACCENT }
          /> */}
          {isMobile && <Spacer height={10} />}
          { (!isMobile || showComments) && commentPane}
          {/* { descriptionPane} */}
        </div>
      </div>
    </div>
  );
}

export default ViewMedia;