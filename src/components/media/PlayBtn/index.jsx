import React from 'react';

import styles from './index.module.scss';

const playIconRed = require('$assets/images/player/play_red.svg');
const pauseIcon = require('$assets/images/player/pause.svg');

const PlayBtn = (props) => {
  // props
  const {
    isLoading,
    isPlaying,
    size,
  } = props;

  // render
  if (isLoading) {
    return (
      <span
        className="spinner-border spinner-border-lg text-light m-2"
        role="status"
        aria-hidden="true"
      />
    );
  }

  if (isPlaying) {
    return (
      <div className={styles.playIcon}>
        <img
          className={styles.pauseIcon}
          src={pauseIcon}
          alt=""
        />
      </div>
    );
  }

  return (
    <div className={styles.playIcon}>
      <img
        src={playIconRed}
        alt=""
        height={size}
        width={size}
      />
    </div>
  );
}

export default PlayBtn;
