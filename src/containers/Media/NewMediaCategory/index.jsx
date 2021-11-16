import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import GenreSelector from '$components/common/GenreSelector';
import { routePaths } from '$common/routeConfig';

import styles from './index.module.scss';

const NewMediaCategory = () => {
  // state
  const [selected, setSelected] = useState(['songs']);

  // store
  const history = useHistory();

  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  // handlers
  const handleNext = () => {
    if (selected[0] === 'album') {
      history.push(routePaths.newAlbum);
      return;
    }

    if (selected[0] === 'video' || selected[0] === 'movie') {
      history.push(routePaths.newVideo, { type: selected[0] });
      return;
    }

    if (selected[0] === 'series') {
      history.push(routePaths.newSeries);
      return; 
    }

    history.push(routePaths.mediaUpload);
  }

  const handleSelect = (name) => {
    setSelected([name]);
  }

  // render
  return (
    <div className={`d-flex flex-column ${styles.wrapper}`}>
      <GenreSelector
        handleNext={handleNext}
        handleSelect={handleSelect}
        selected={selected}
        title={t('what_would_you_like_to_upload')}
        type="media"
      />
    </div>
  );
}

export default NewMediaCategory;;
