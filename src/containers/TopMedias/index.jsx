import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import GridMedia from '$components/media/GridMedia';
import TabsMark from '$components/common/TabsMark';

import { getNewReleases, getTopMedias } from '$redux/features/media';

import styles from './index.module.scss';

const TopMedias = () => {
  // state
  const [selected, setSelected] = useState('audio');

  // store
  const dispatch = useDispatch();
  const topMedias = useSelector((store) => store.media.topMedias);
  const getTopMediasPending = useSelector((store) => store.media.getTopMediasPending);

  useEffect(() => {
    dispatch(getTopMedias({ category: 'audio' }))
  }, []);

  // handlers
  const handleSelect = (name) => {
    setSelected(name);
    if (topMedias[name].length < 1) {
      dispatch(getTopMedias({ category: name }));
    }
  }

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
          Top Chart
        </span>
      </div>
      <div className={selected !== 'audio' ? 'd-none' : ''}>
        <GridMedia
          title="Top Medias"
          values={topMedias.audio}
          isLoading={getTopMediasPending && topMedias.audio.length < 1}
          name="audio-top-medias"
          showHeader
        />
      </div>
      <div className={selected !== 'video' ? 'd-none' : ''}>
        <GridMedia
          title="Top Medias"
          name="video-top-medias"
          values={topMedias.video}
          isLoading={getTopMediasPending && topMedias.video.length < 1}
          type="video"
        />
      </div>
      <div className={selected !== 'movie' ? 'd-none' : ''}>
        <GridMedia
          title="Top Medias"
          name="theatre-top-medias"
          values={topMedias.movie}
          isLoading={getTopMediasPending && topMedias.movie.length < 1}
          type="video"
        />
      </div>
    </div>
  );
};

export default TopMedias;
