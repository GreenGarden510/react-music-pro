import React, { useState } from 'react'
import { PropTypes } from 'prop-types';
import VideoSliderVideo from './video';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const PostItemVideoSlider = (props) => {
    //props
    const { videos } = props;
    
    return (
        <div>
            <Carousel showThumbs={false}>
                {videos.map(video => <VideoSliderVideo key={video.url} filename={video.url} />)}
            </Carousel>
        </div>
    )
}

PostItemVideoSlider.defaultProps = {
    videos: [],
}

PostItemVideoSlider.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
        caption: PropTypes.string
    })).isRequired
}

export default PostItemVideoSlider;