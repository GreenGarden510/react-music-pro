import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import Preview from '$components/common/Preview';
import FeatureHome from '$components/common/FeatureHome';
import SimplePreview from '$components/common/SimplePreview';
import styles from './index.module.scss';

const GridMedia = (props) => {
  // props
  const {
    values,
    title,
    isLoading,
    type,
    name,
  } = props;

  const getMedia = useCallback((item, idx) => {
    let avatar_url = item.owner_avatar_url;
    if(item.owner_avatar_url == "null") avatar_url = null;
    if (type === 'audio') {
      return (
        <FeatureHome
          key={`feature-home-songs-${idx}`}
          mediaUrl={item.media_url}
          mediaId={item.media_id}
          avatar={item.cover_url}
          artistId={item.owner_id}
          source={avatar_url}
          owner_name={item.owner_name}
          title={item.name}
          country={item.country}
          category={item.category}
          description={item.description}

          likes={item.likes || undefined}
          plays={item.plays}
          comment_num={item.comment_num}
        />
      );
    }

    if (type === 'artist') {
      return (
        <SimplePreview
          description={item.full_name}
          url={item.avatar_url}
          handleClick={() => null}
          isRounded
        />
      )
    }

    return (
      <FeatureHome
      key={`feature-home-video-${idx}`}
      mediaUrl={item.media_url}
      mediaId={item.media_id}
      avatar={item.cover_url}
      artistId={item.owner_id}
      source={avatar_url}
      owner_name={item.owner_name}
      title={item.name}
      country={item.country}
      category={item.category}
      description={item.description}

      likes={item.likes || undefined}
      plays={item.plays}
      comment_num={item.comment_num}
      />
    );
  }, [type]);

  // render
  return (
    <div className="row">
      {
        values.map((item, idx) => 
            {if(type == 'audio') return (<div key={idx} className={`col-xs-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 ${styles.gridItem}`}>{getMedia(item, idx)}</div>)
            else return (
              <div key={idx} className={`col-xs-6 col-sm-6 col-md-6 col-lg-4 col-xl-4 ${styles.gridItem}`}>{getMedia(item, idx)}</div>
            )
            }

        )
      }
    </div>
  );
}

GridMedia.defaultProps = {
  values: [],
  title: '',
  isLoading: false,
  type: 'audio',
};

GridMedia.propTypes = {
  values: PropTypes.array,
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  type: PropTypes.string,
};



export default GridMedia;

