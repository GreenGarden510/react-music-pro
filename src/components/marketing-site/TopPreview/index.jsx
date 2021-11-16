import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import FeatureMark from '$components/common/FeatureMark';
import { showModal } from '$redux/features/modal';
import FeatureHome from '../../common/FeatureHome';

const TopPreview = (props) => {
  // props
  const {
    values,
    isLoading,
  } = props;

  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  // store
  const dispatch = useDispatch();

  // handlers
  const handleClick = () => {
    dispatch(showModal('ALERT_MODAL'));
  }

  // render
  return (
    <div className="row">
      {
        isLoading && (
          <p className="text-center">
            {t('loading')}
          </p>
        )
      }
      {
        values.map((item, idx) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={`${item.media_id}-${idx}`}>
          
          <FeatureHome
            key={`feature-home-songs-${idx}`}
            mediaUrl={item.media_url}
            mediaId={item.media_id}
            avatar={item.cover_url}
            artistId={item.owner_id}
            source={item.avatar_url}
            owner_name={item.owner_name}
            title={item.name}
            country={item.country}
            category={item.category}
            description={item.description}

            likes={item.likes || undefined}
            plays={item.plays}
            comment_num={item.comment_num}
          />

          </div>
        ))
      }
    </div>
  );
}

export default TopPreview;
