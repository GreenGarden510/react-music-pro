import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ScrollMedia from '$components/media/ScrollMedia';
import TabsMark from '$components/common/TabsMark';

import { getNewReleases, getTopMedias, getRandomMedias, getTrendMedias } from '$redux/features/media';

import styles from './index.module.scss';
import { routePaths } from '../../common/routeConfig';

const Home = () => {
  // state
  const [selected, setSelected] = useState('audio');

  // store
  const dispatch = useDispatch();
  const newReleases = useSelector((store) => store.media.newReleases);
  const getNewReleasesPending = useSelector((store) => store.media.getNewReleasesPending);
  const addLikesPending = useSelector((store) => store.user.addLikesPending);
  const removeLikesPending = useSelector((store) => store.user.removeLikesPending);
  const topMedias = useSelector((store) => store.media.topMedias);
  const getTopMediasPending = useSelector((store) => store.media.getTopMediasPending);
  const randomMedias = useSelector((store) => store.media.randomMedias);
  const getRandomMediasPending = useSelector((store) => store.media.getRandomMediasPending);
  const trendMedias = useSelector((store) => store.media.trendMedias);
  const getTrendMediasPending = useSelector((store) => store.media.getTrendMediasPending);
  const favorites = useSelector((store) => store.authentication.user.favourites);
  // const user_id = useSelector((store) => store.authentication.user_id);

  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  // effects
  useEffect(() => {
    // add monitor?
    dispatch(getNewReleases({ category: 'audio' }));
    dispatch(getTopMedias({ category: 'audio' }));
    dispatch(getRandomMedias({ category: 'audio' }));
    dispatch(getTrendMedias({ category: 'audio' }));
  }, []);

  useEffect(() => {
    if (addLikesPending || removeLikesPending) {
      return;
    }
    dispatch(getNewReleases({ category: selected }));
    dispatch(getTopMedias({ category: selected }));
    dispatch(getRandomMedias({ category: selected }));
    dispatch(getTrendMedias({ category: selected }));
  }, [addLikesPending, removeLikesPending]);

  // handlers
  const handleSelect = (name) => {
    setSelected(name);
    if (newReleases[name].length < 1) {
      dispatch(getNewReleases({ category: name }));
    }
    if (topMedias[name].length < 1) {
      dispatch(getTopMedias({ category: name }));
    }
    if (randomMedias[name].length < 1) {
      dispatch(getRandomMedias({ category: name }));
    }
    if (trendMedias[name].length < 1) {
      dispatch(getTrendMedias({ category: name }));
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
      </div>
      <div style={{clear: 'both'}}></div>
      <div className={selected !== 'audio' ? 'd-none' : ''}>
        <ScrollMedia
          title={t('new_release')}
          values={newReleases.audio}
          isLoading={getNewReleasesPending && newReleases.audio.length < 1}
          name="audio-new-release"
          viewMore={`${routePaths.newRelease}`}
          showHeader
        />
        <ScrollMedia
          title={t('top_chart')}
          values={topMedias.audio}
          isLoading={getTopMediasPending && topMedias.audio.length < 1}
          name="audio-top-medias"
          viewMore={routePaths.topChart}
          showHeader
        />
        <ScrollMedia
          title={t('random_medias')}
          values={randomMedias.audio}
          isLoading={getRandomMediasPending && randomMedias.audio.length < 1}
          name="audio-random-medias"
          showHeader
        />
        <ScrollMedia
          title={t('trend_medias')}
          values={trendMedias.audio}
          isLoading={getTrendMediasPending && trendMedias.audio.length < 1}
          name="audio-trend-medias"
          showHeader
        />
        <ScrollMedia
          title={t('favorites')}
          name="audio-favorite"
          values={favorites.filter((item) => item.category === 'audio')}
        />
      </div>
      <div className={selected !== 'video' ? 'd-none' : ''}>
        <ScrollMedia
          title={t('new_release')}
          name="video-new-release"
          values={newReleases.video}
          isLoading={getNewReleasesPending && newReleases.video.length < 1}
          viewMore={routePaths.newRelease}
          type="video"
        />
        <ScrollMedia
          title={t('top_chart')}
          name="video-top-medias"
          values={topMedias.video}
          isLoading={getTopMediasPending && topMedias.video.length < 1}
          viewMore={routePaths.topChart}
          type="video"
        />
        <ScrollMedia
          title={t('random_medias')}
          name="video-random-medias"
          values={randomMedias.video}
          isLoading={getRandomMediasPending && randomMedias.video.length < 1}
          type="video"
        />
        <ScrollMedia
          title={t('trend_medias')}
          name="video-trend-medias"
          values={trendMedias.video}
          isLoading={getTrendMediasPending && trendMedias.video.length < 1}
          type="video"
        />
        <ScrollMedia
          title={t('favorites')}
          name="video-favorite"
          values={favorites.filter((item) => item.category === 'video')}
          type="video"
        />
      </div>
      <div className={selected !== 'movie' ? 'd-none' : ''}>
        <ScrollMedia
          title={t('new_release')}
          name="theatre-new-release"
          values={newReleases.movie}
          isLoading={getNewReleasesPending && newReleases.movie.length < 1}
          viewMore={routePaths.newRelease}
          type="video"
        />
        <ScrollMedia
          title={t('top_chart')}
          name="theatre-top-medias"
          values={topMedias.movie}
          isLoading={getTopMediasPending && topMedias.movie.length < 1}
          viewMore={routePaths.topChart}
          type="video"
        />
        <ScrollMedia
          title={t('random_medias')}
          name="theatre-random-medias"
          values={randomMedias.movie}
          isLoading={getRandomMediasPending && randomMedias.movie.length < 1}
          type="video"
        />
        <ScrollMedia
          title={t('trend_medias')}
          name="theatre-trend-medias"
          values={trendMedias.movie}
          isLoading={getTrendMediasPending && trendMedias.movie.length < 1}
          type="video"
        />
        <ScrollMedia
          title={t('favorites')}
          name="movie-favorite"
          values={favorites.filter((item) => item.category === 'movie')}
          type="video"
        />
      </div>
    </div>
  );
};

export default Home;
