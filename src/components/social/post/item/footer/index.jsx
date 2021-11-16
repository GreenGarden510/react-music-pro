import React, { useEffect, useState } from 'react'
import { PropTypes } from 'prop-types';
import styles from './index.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { addPostLike, removePostLike, getPost } from '../../../../../redux/features/post';
import PostItemComments from '../comments';

const PostItemFooter = (props) => {
    //props
    const { post } = props;
    const { post_id, likes, comments } = post;

    //state
    const [isLiked, setIsLiked] = useState(false);
    const [focus, setFocus] = useState(false); //There are multiple of this component that listen to the same state, we should be able to differentiate the active component
    const [commentMode, setCommentMode] = useState(false);

    //store
    const dispatch = useDispatch();
    const { token, user } = useSelector(state => state.authentication);
    const addPostLikePending = useSelector(state => state.post.addPostLikePending);
    const addPostLikeSuccess = useSelector(state => state.post.addPostLikeSuccess);
    const addPostLikeError = useSelector(state => state.post.addPostLikeError);
    const removePostLikePending = useSelector(state => state.post.removePostLikePending);
    const removePostLikeSuccess = useSelector(state => state.post.removePostLikeSuccess);
    const removePostLikeError = useSelector(state => state.post.removePostLikeError);
    const getPostPending = useSelector(state => state.post.getPostPending);

    //effects
    useEffect(() => {
        if (!likes) return;
        if (likes.some(like => like.user_id == user.user_id)) {
            setIsLiked(true);
        } else {
            setIsLiked(false);
        }
    }, [likes, user]);

    useEffect(() => {
        if (!addPostLikeError) return;
        setIsLiked(false);
    }, [addPostLikeError]);

    useEffect(() => {
        if (!removePostLikeError) return;
        setIsLiked(true);
    }, [removePostLikeError]);

    useEffect(() => {
        if (!addPostLikeSuccess || !focus) return;
        dispatch(getPost(post_id));
        setFocus(false);
    }, [addPostLikeSuccess, focus]);

    useEffect(() => {
        if (!removePostLikeSuccess || !focus) return;
        dispatch(getPost(post_id));
        setFocus(false);
    }, [removePostLikeSuccess, focus])

    //handlers
    const handleLike = () => {
        setFocus(true);
        if (isLiked) {
            dispatch(removePostLike(post_id))
        } else {
            dispatch(addPostLike(post_id));
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className="d-flex mt-3">
                <div className={`mr-3 d-flex align-items-center ${styles.iconButton}`} onClick={handleLike}>
                    {(addPostLikePending || removePostLikePending) && focus ? (
                        <div class="spinner-border text-light" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    ) : isLiked 
                        ? <img src={require("$assets/images/icons/like-solid-pink.svg")} alt="" height="20px" /> 
                        : <img src={require("$assets/images/icons/like-solid.svg")} alt="" height="20px" />}
                    <span className="ml-2">{likes ? likes.length : 0} likes</span>
                </div>
                <div className={`d-flex align-items-center ${styles.iconButton}`} onClick={() => setCommentMode(!commentMode)}>
                    <img src={require("$assets/images/icons/comment.svg")} alt="" height="20px" />
                    <span className="ml-2">{comments ? comments.length : 0} comments</span>
                </div>
            </div>

            {commentMode ? (
                <div className="mt-3">
                    <PostItemComments post={post} />
                </div>
            ): null}
        </div>
    )
}

PostItemFooter.defaultProps = {
    post: {}
}

PostItemFooter.propTypes = {
    post: PropTypes.shape({
        post_id: PropTypes.string.required,
        caption: PropTypes.string,
        content: PropTypes.string,
        description: PropTypes.string,
        featured_image_url: PropTypes.string,
        featured_video_url: PropTypes.string,
        featured_audio_url: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.shape({
            url: PropTypes.string,
            caption: PropTypes.string,
        })),
        videos: PropTypes.arrayOf(PropTypes.shape({
            url: PropTypes.string,
            caption: PropTypes.string,
        })),
        user: PropTypes.shape({
            full_name: PropTypes.string,
            avatar_url: PropTypes.string,
        }),
        created_at: PropTypes.string,
    }),
}

export default PostItemFooter;