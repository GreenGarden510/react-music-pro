import React, { useState, useEffect } from 'react'
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';
import { getMediaUrl } from '../../../../../common/utils';
import styles from './index.module.scss';

const VideoSliderVideo = (props) => {
    //props
    const { filename } = props;

    //state
    const [videoUrl, setVideoUrl] = useState(null);

    //store
    const token = useSelector(state => state.authentication.token);

    //effects
    useEffect(async () => {
        const _url = await getMediaUrl(filename, token);
        setVideoUrl(_url);
    }, []);

    return (
        <div className={styles.videoWrapper}>
            <video src={videoUrl} controls></video>
        </div>
    )
}

VideoSliderVideo.defaultProps = {
    filename: '',
}

VideoSliderVideo.propTypes = {
    filename: PropTypes.string.isRequired
}

export default VideoSliderVideo