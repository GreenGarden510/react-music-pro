import React from 'react';
import { useSelector } from 'react-redux';
import Progress from '../../common/Progress';

import styles from './index.module.scss';

const Loader = () => {
  //store
  const  progress = useSelector((store) => store.media.saveMediaProgress);
  // render
  return ( // <div className="spinner-border" role="status" />
    <>
      <div className={`d-flex align-items-center justify-content-center ${styles.spinnerBorderWrapper}`}>
        <div className={`spinner-border ${styles.spinnerBorder}`} role="status" />
        <p className={styles.spinnerWrapperText}>Uploading...</p>
      </div>
      {/* Progress indicator */}
      <div className="d-flex align-items-center progress-wrapper mx-5">
          <div className="progress">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="mx-2">
            {parseInt(progress)}% {'uploading'}
          </span>
        </div>
    </>
  );
}

export default Loader;
