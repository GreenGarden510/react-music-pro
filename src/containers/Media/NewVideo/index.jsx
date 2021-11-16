import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import DragDrop from '$components/common/DragDrop';
import Button from '$components/common/Button';
import InputField from '$components/forms/InputField';
import AvatarInput from '$components/common/AvatarInput';
import VideoPlayer from '$components/media/VideoPlayer';

import { bytesToSize, generatePreview, movieGenres, getDuration } from '$common/utils';
import { addMedia, saveMedia } from '$redux/features/media';

import { menus, descriptionMenu } from './menus';

import styles from './index.module.scss';
import { routePaths } from '../../../common/routeConfig';
import { crop } from '../../../redux/features/croptool';

const getType = {
  movie: 'Upload Movie',
  video: 'Upload Video',
};

const NewVideo = () => {

  // store
  const history = useHistory();
  const push = history.push;
  const dispatch = useDispatch();
  const userId = useSelector((store) => store.authentication.user.user_id);
  const userAvatarUrl = useSelector((store) => store.authentication.user.avatar_url);
  const addMediaPending = useSelector((store) => store.media.addMediaPending);
  const addMediaUploadProgress = useSelector((store) => store.media.addMediaUploadProgress);
  const addMediaUploadedSize = useSelector((store) => store.media.addMediaUploadedSize);
  const addMediaTotalSize = useSelector((store) => store.media.addMediaTotalSize);
  const croppedImage = useSelector((state) => state.croptool.cropped)

  const uploadType = (history.location.state && history.location.state.type) || 'video';
  const type = getType[uploadType];

  // state
  const [file, setFile] = useState(null);
  const [values, setValues] = useState({
    duration: 0,
  });
  const [coverFile, setCoverFile] = useState(null);
  const [localCoverUrl, setLocalCoverUrl] = useState(null);

  useEffect(async () => {
    const file = await fetch(croppedImage).then(res => res.blob());
    const url = await generatePreview(file)

    setLocalCoverUrl(url);
    setCoverFile(file);
  }, [croppedImage]);

  // hadnlers
  const handleFileChange = (files) => {
    setFile(files[0]);
    getDuration(files[0], 'video', (value) => {
      handleChange('duration', value);
    });
  }

  const handleChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  }

  const handleSave = async () => {
    const mediaRes = await dispatch(saveMedia(coverFile));
    dispatch(addMedia({
      name: values.title,
      description: values.description,
      genres: values.genre.map((item) => item.value),
      cover_url: mediaRes.payload,
      media_url: 'placeholderurl',
      owner_id: userId,
      category: uploadType,
      duration: values.duration,
      owner_avatar_url: userAvatarUrl,
      production_company: values.productionCompany,
      movie_director: values.director,
      staring: values.starring,
      release_date: values.startingDate,
      file,
    }));
  }

  const handleClear = () => {
    setFile(null);
    const fileDom = document.querySelector('#file-input');
    fileDom.value = '';
  }

  const handleCoverChange = async (files) => {
    const url = await generatePreview(files[0]);
    dispatch(crop({
      src: url,
      aspectRatio: 4/1,
      width: 1000, 
      locked: false,
    }))
  }

  const buildInputPanel = () => {
    return (
      <>

        <p className={styles.paneTitle}>{type}</p>

        <div className={styles.inputContainer}>
          <p className={styles.title}>{file.name} - {bytesToSize(file.size)}</p>
          <div className={styles.cover}>
            <AvatarInput
              url={localCoverUrl}
              onChange={handleCoverChange}
            />
          </div>
          <div className={styles.inputFormWrapper}>
            <div className="row">
              {
                menus.map((menu) => {
                  const item = {
                    ...menu,
                  };

                  if (item.options && uploadType === 'movie') {
                    item.options = movieGenres;
                  }

                  return (
                    <div
                      className='col-12 col-md-6'
                      key={`new-video-${menu.name}`}
                    >
                      <InputField
                        field={{
                          ...item,
                          value: values[menu.name]
                        }}
                        onChange={handleChange}
                      />
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6">
              <VideoPlayer
                file={file}
              />
            </div>
            <div className="col-12 col-md-6">
              <InputField
                field={{
                  ...descriptionMenu,
                  value: values.description
                }}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-2">
          <Button
            isSecondary
            onClick={handleClear}
          >
            Clear
              </Button>
          <Button
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </>
    );
  }

  const getContent = () => {
    if (addMediaPending) {
      return (
        <div className="d-flex">
          <div className={`spinner-border ${styles.spinnerLg}`} role="status" />
          <div className="ml-4">
            <p>Your {type} is getting uploaded.</p>
            <p>Please don&apos;t refresh your browser.</p>
            <p>You may continue using other functions of the app</p>
            {/* Progress indicator */}
            {/* <p><strong>Total: </strong> {bytesToSize(addMediaTotalSize)}</p> */}
            <p><strong>Uploaded: </strong> {bytesToSize(addMediaUploadedSize, 3)}</p>
            <div className="d-flex align-items-center progress-wrapper mx-5">
                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${addMediaUploadProgress}%` }} />
                </div>
                <span className="mx-2">
                  {parseInt(addMediaUploadProgress)}% {'uploading'}
                </span>
              </div>
          </div>
        </div>
      );
    }

    if (file) {
      return buildInputPanel();
    }

    return (
      <div>
        <button className="btn btn-primary mb-3" onClick={() => push(routePaths.newMediaCategory)}>Back</button>
        <DragDrop
          onChange={handleFileChange}
          acceptedFiles="video/mp4,video/x-m4v,video/*"
        />
      </div>
    )
  }

  // render
  return (
    <div className={styles.panelContainer}>
      <div className="row justify-content-center">
        <div className="col-10 col-sm-10 col-lg-8">
          {getContent()}
        </div>
      </div>
    </div>
  );
}

export default NewVideo;
