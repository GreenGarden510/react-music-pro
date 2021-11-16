import React, { useEffect, useState } from 'react'
import styles from './index.module.scss';
import { PropTypes } from 'prop-types';
import { formatDate, getMediaUrl } from '../../../../../common/utils';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost } from '../../../../../redux/features/post';

const PostItemHeader = (props) => {
    //props
    const { post, postType } = props;
    const { user, post_id, created_at } = post;
    const { full_name: fullname, avatar_url } = user;

    //state
    const [showOptions, setShowOptions] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState(null)

    //store
    const dispatch = useDispatch();
    const token = useSelector(state => state.authentication.token);
   
    //effetcts
    useEffect(async () => {
        if (!avatar_url || !token) return;
        const _url = await getMediaUrl(avatar_url, token);
        setAvatarUrl(_url);
    }, [avatar_url, token]);

    //handles
    const handleDelete = () => {
        dispatch(deletePost(post_id));
    }

    return (
        <div className={`d-flex align-items-center`}>
            <img className={`${styles.userAvatar}`} src={avatarUrl} alt="" />
            <div className={`ml-3`}>
                <div className="d-flex align-content-center">
                    <h4 className={`m-0 text-light`}>{fullname}</h4>
                    <span className="m-0 ml-2">{postType}</span>
                </div>
                <span>{formatDate(created_at)}</span>
            </div>
            <div className={`ml-auto align-self-start ${styles.dropdown}`}>
                <span onClick={() => setShowOptions(!showOptions)}>•••</span>
                {showOptions && (
                    <div className={`d-flex flex-column`}>
                        <div>
                            <strong>Report</strong>
                        </div>

                        <div onClick={handleDelete}>
                            <strong>Delete Post</strong>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

PostItemHeader.defaultProps = {
    postType: "Text Post",
    post: {}
  };
  
PostItemHeader.propTypes = {
    postType: PropTypes.string,
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
};

export default PostItemHeader;