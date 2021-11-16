import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ScrollMedia from '$components/media/ScrollMedia';
import { mediaSorter } from '$common/utils';

import styles from './index.module.scss';

const History = () => {
  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  // store
  const userHistory = useSelector((store) => store.user.history);
  const getHistoryPending = useSelector((store) => store.user.getHistoryPending);

  // state
  const [values, setValues] = useState({});

  // effects
  useEffect(() => {
    setValues(mediaSorter(userHistory));
  }, [userHistory]);

  // render
  return (
    <div className={`${styles.homeContent} ${styles.historyContentTop}`}>
      <p className={`${styles.homeHeading} py-4`}>{t('history')} </p>
      <ScrollMedia
        title="songs"
        isLoading={getHistoryPending}
        values={values.audio}
        name="history-songs"
        type="audio"
        showHeader
      />
      <ScrollMedia
        isLoading={getHistoryPending}
        title="videos"
        values={values.video}
        name="history-video"
        showHeader
      />
      <ScrollMedia
        isLoading={getHistoryPending}
        title="movies"
        values={values.movie}
        name="history-movie"
        showHeader
      />
    </div>
  );
}

export default History;