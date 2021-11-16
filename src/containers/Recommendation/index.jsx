import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import GridMedia from '$components/media/GridMedia';
import TabsMark from '$components/common/TabsMark';

import { getPopularRecommended } from '$redux/features/media';

import styles from './index.module.scss';

const Recommendation = () => {
    // state
    const [selected, setSelected] = useState('audio');

    // store
    const dispatch = useDispatch();
    const popularRecommendedMedia = useSelector((store) => store.media.popularRecommendedMedia);
    const getPopularRecommendedPending = useSelector((store) => store.media.getPopularRecommendedPending);
    const user_id = useSelector((store) => store.authentication.user.user_id);

    const audios = popularRecommendedMedia.media.filter(item => item.category == 'audio')
    const videos = popularRecommendedMedia.media.filter(item => item.category == 'video')
    const movies = popularRecommendedMedia.media.filter(item => item.category == 'movie')

    useEffect(() => { dispatch(getPopularRecommended(user_id)); }, []);

    // handlers
    const handleSelect = (name) => { setSelected(name); }

    // render
    return (
        <div className={styles.homeContent}>

            <div className={styles.homeTabsWrapper}>

                <TabsMark
                    onSelect={handleSelect}
                    selected={selected}
                    activeColor="white"
                />
                <div style={{ clear: 'both' }}></div>
                <span className={styles.heading}>
                    Recommendation
                </span>
            </div>
            <div className={selected !== 'audio' ? 'd-none' : ''}>
                <GridMedia
                    title="Recommend Popular Audio"
                    values={audios}
                    isLoading={getPopularRecommendedPending && popularRecommendedMedia.media.length < 1}
                    name="audio-new-release"
                    showHeader
                />
            </div>
            <div className={selected !== 'video' ? 'd-none' : ''}>
                <GridMedia
                    title="Recommend Popular Video"
                    name="video-new-release"
                    values={videos}
                    isLoading={getPopularRecommendedPending && popularRecommendedMedia.media.length < 1}
                    type="video"
                />
            </div>
            <div className={selected !== 'movie' ? 'd-none' : ''}>
                <GridMedia
                    title="Recommend Popular Movie"
                    name="theatre-new-release"
                    values={movies}
                    isLoading={getPopularRecommendedPending && popularRecommendedMedia.media.length < 1}
                    type="movie"
                />
            </div>
        </div>
    );
};

export default Recommendation;
