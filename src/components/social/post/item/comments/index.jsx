import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss';
import { PropTypes } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addPostComment, getPost } from '../../../../../redux/features/post';
import { deleteComment } from '../../../../../redux/features/media';
import CommentRow from '../../../../media/CommentRow/index';

const PostItemComments = (props) => {
    //props
    const { post } = props;
    const { post_id, comments } = post;

    //refs
    const textareaRef = useRef();

    //state
    const [comment, setComment] = useState('');
    const [focus, setFocus] = useState(false);

    //store
    const dispatch = useDispatch();
    const userId = useSelector(state => state.authentication.user.user_id);
    const addPostCommentPending = useSelector(state => state.post.addPostCommentPending);
    const addPostCommentSuccess = useSelector(state => state.post.addPostCommentSuccess);
    const addPostCommentError = useSelector(state => state.post.addPostCommentError);

    //effects
    useEffect(() => {
        if (!addPostCommentSuccess || !focus) return;
        dispatch(getPost(post_id));
    }, [addPostCommentSuccess, focus]);

    useEffect(() => {
        if (!addPostCommentError) return;

    }, [addPostCommentError])

    //handles
    const handleKeyDown = async (e) => {
        if (e.key == 'Enter' && !e.shiftKey && comment) {
            setFocus(true);
            //prepare payload
            const payload = {
                user_id: userId,
                post_id: post_id,
                value: comment,
            }
            dispatch(addPostComment(payload));

            setComment('');
            textareaRef.current.blur();
        }
    }

    const handleChange = (e) => {
        setComment(e.target.value);
    }

    const handleDeleteComment = (commentId) => {
        if(!confirm("Are you going to delete this item?")) return;
        dispatch(deleteComment(commentId));
      }

    return (
        <div className={styles.wrapper}>
            {comments && comments.map((comment, idx) => (
                 <div className="mb-3">
                     <CommentRow
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
                 </div>
            ))}
            <div className={styles.form}>
                <textarea ref={textareaRef} name="" id="" cols="2" placeholder="Write a comment..." onChange={handleChange} onKeyDown={handleKeyDown} value={comment}></textarea>
                {addPostCommentPending ? <small>Saving...</small> : null}
            </div>
        </div>
    )
}

PostItemComments.defaultProps = {
    post: {},
}

PostItemComments.propTypes = {
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

export default PostItemComments;