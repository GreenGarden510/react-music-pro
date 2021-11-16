import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from '$components/common/Button';

import styles from './index.module.scss';

const upIcon = require('$assets/images/icons/arrow-up.svg');

const DragDrop = (props) => {
  // props
  const {
    onChange,
    isMulti,
    acceptedFiles,
  } = props;

  // state
  const [active, setActive] = useState(false);

  const lang = useSelector(store => store.user.language);
  const { t, i18n } = useTranslation('common');
  useEffect(() => { i18n.changeLanguage(lang); }, [lang]);

  // refs
  const fileRef = useRef(null);

  // handlers
  const handleDrop = (ev) => {
    ev.preventDefault();
    let currentUpload = [];

    if (ev.dataTransfer.items) {
      for (let i = 0; i < ev.dataTransfer.items.length; i += 1) {
        if (ev.dataTransfer.items[i].kind === 'file') {
          const file = ev.dataTransfer.items[i].getAsFile();
          currentUpload.push(file);
        }
      }
    } else {
      currentUpload = ev.dataTransfer.files;
    }

    onChange(currentUpload);
    setActive(false); // reset upload state
  }

  const handleDragOver = (evt) => {
    // Prevent default behavior (Prevent file from being opened)
    evt.preventDefault();
  }

  const handleDragEnter = (evt) => {
    // Prevent default behavior (Prevent file from being opened)
    evt.preventDefault();
    setActive(true);
  }

  const handleDragLeave = (evt) => {
    evt.preventDefault();
    setActive(false);
  }

  const handleSelectFile = () => {
    fileRef.current.click();
  }

  const handleChange = () => {
    onChange(fileRef.current.files);
  }

  // render
  return (
    <>
      <div className={`d-flex justify-content-center align-items-center ${styles.dragDropWrapper}`}>
        <div
          className={`d-flex justify-content-center align-items-center ${styles.dragDropInner} ${active ? styles.dragActive : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDragEnter={handleDragEnter}
        >
          {
            active ? (
              <p className={`text-center ${styles.dragTitle}`}>
                {t('drop_your_files_here')}
              </p>
            ) : (
              <Button
                onClick={handleSelectFile}
                isCustom
                hideDefault
              >
                <div className={`d-flex align-items-center ${styles.btnWrapper}`}>
                  <img
                    className={styles.fileBtnWrapper}
                    src={upIcon}
                    alt=""
                  />
                  <span>{t('choose_or_drop_files_to_upload')}</span>
                </div>
              </Button>
            )
          }
        </div>
      </div>
      <input
        id="file-input"
        className="d-none"
        type="file"
        ref={fileRef}
        onChange={handleChange}
        accept={acceptedFiles}
        multiple={isMulti}
      />
    </>
  );
}

DragDrop.defaultProps = {
  isMulti: false,
  acceptedFiles: ".mp3,audio/*",
};

DragDrop.propTypes = {
  onChange: PropTypes.func.isRequired,
  isMulti: PropTypes.bool,
  acceptedFiles:PropTypes.string,
}

export default DragDrop;
