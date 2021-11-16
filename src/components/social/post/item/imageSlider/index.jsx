import React, { useEffect, useState } from 'react'
import { PropTypes } from 'prop-types';
import { getMediaUrl } from '../../../../../common/utils';
import { useSelector } from 'react-redux';
import ImageSliderImage from './image';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import styles from './index.module.scss';


const PostItemImageSlider = (props) => {
    //props
    const { images } = props;


    return (
        <div className={`${styles.wrapper}`}>
            <Carousel showThumbs={false}>
                {images.map((image, index) => <ImageSliderImage key={image.url} filename={image.url} />)}
            </Carousel>
        </div>
    )
}

PostItemImageSlider.defaultsProps = {
    images: []
}

PostItemImageSlider.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
        caption: PropTypes.string,
    })).isRequired
}

export default PostItemImageSlider;