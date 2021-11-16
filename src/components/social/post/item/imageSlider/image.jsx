import React, { useEffect, useState } from 'react'
import { PropTypes } from 'prop-types';
import { getMediaUrl } from '../../../../../common/utils';
import { useSelector } from 'react-redux';
import styles from './index.module.scss';

const ImageSliderImage = (props) => {
    //props
    const { filename } = props;

    //state
    const [imageUrl, setimageUrl] = useState(null);

    //store
    const token = useSelector(state => state.authentication.token);

    useEffect(async () => {
        const _url = await getMediaUrl(filename, token);
        setimageUrl(_url);
    }, [])

    return (
        <div className={`${styles.imageWrapper}`}>
            <img src={imageUrl} />
        </div>
    )
}

ImageSliderImage.defaultProps = {
    filename: "",
}

ImageSliderImage.propTypes = {
    filename: PropTypes.string.isRequired,
}

export default ImageSliderImage;