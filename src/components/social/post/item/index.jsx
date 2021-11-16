import React, { useEffect, useState } from 'react'
import { PropTypes } from 'prop-types';
import styles from './index.module.scss';
import PostItemHeader from './header';
import { getMediaUrl } from '../../../../common/utils';
import { useSelector } from 'react-redux';
import PostItemImageSlider from './imageSlider';
import PostItemVideoSlider from './videoSlider';
import PostItemFooter from './footer';

export const PostTypes = {
    TEXT: 1,
    FEATURED_IMAGE: 2,
    FEATURED_VIDEO: 3,
    FEATURED_AUDIO: 4,
    IMAGES: 5,
    VIDEOS: 6,
    STORY: 7,
}

const PostItem = (props) => {
    //props
    const { post } = props;
    const { content, images, videos, user, created_at } = post;
    const { full_name, avatar_url } = user

    //state
    const [postType, setpostType] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);

    //store
    const token = useSelector(state => state.authentication.token);

    //effects
    useEffect(() => {
        if (!images && !videos) {
            setpostType(PostTypes.TEXT);
        } else {
            if (images) {
                setpostType(PostTypes.IMAGES);
            }
            if (videos) {
                setpostType(PostTypes.VIDEOS);
            }
        }
    }, [])

    switch (postType) {
        case PostTypes.IMAGES:
            return (
                <div className={`${styles.wrapper}`}>
                    <PostItemHeader post={post} postType="College Post" />
                    <div className="my-2"></div>
                    <p>{content}</p>
                    <div className="mb-2">
                        <PostItemImageSlider images={images} />
                    </div>
                    <PostItemFooter post={post} />
                </div>
            )
            break;

        case PostTypes.VIDEOS:
            return (
                <div className={`${styles.wrapper}`}>
                    <PostItemHeader post={post} postType="Videos" />
                    <div className="my-2"></div>
                    <p>{content}</p>
                    <div className="mb-2">
                        <PostItemVideoSlider videos={videos}  />
                    </div>
                    <PostItemFooter post={post} />
                </div>
            )
    
        default: //text post
            return (
                <div className={`${styles.wrapper}`}>
                    <PostItemHeader post={post} postType="Text Post"  />
                    <div className="my-2"></div>
                    <p>{content}</p>
                    <PostItemFooter post={post} />
                </div>
            )
    }
}

PostItem.defaultProps = {
    post: {}
  };
  
PostItem.propTypes = {
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

export default PostItem;