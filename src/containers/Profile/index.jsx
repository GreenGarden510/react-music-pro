import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AvatarInput from '$components/common/AvatarInput';
import Button from '$components/common/Button';
import InputField from '$components/forms/InputField';
import Tabs from '$components/common/Tabs';
import Feature from '$components/common/Feature';

import { genres, generatePreview } from '$common/utils';
import { handleFetch } from '$common/requestUtils';

import { saveMedia, updateMedia } from '$redux/features/media';
import { updateUser, getUserMedia } from '$redux/features/user';

import { menus, descriptionField, socials } from './menus';

import styles from './index.module.scss';
import FeatureHome from '../../components/common/FeatureHome';
import { deleteMedia } from '../../redux/features/media';
import { showModal } from '$redux/features/modal';
import { crop } from '../../redux/features/croptool';

const options = [
  { name: 'account', title: 'Account' },
  { name: 'songs', title: 'Songs' },
  { name: 'videos', title: 'Videos'},
  { name: 'movies', title: 'Movies'},
  { name: 'albums', title: 'Albums'},
  { name: 'series', title: 'Series' }
];

const initialState = {
  fullName: '',
  description: '',
  phoneNumber: '',
  genre: [],
  email: '',
  user_type: '',
  fb: '',
  yt: '',
  instagram: '',
  twitter: '',
  avatarUrl: '',
};

const Profile = () => {
  // state
  const [selected, setSelected] = useState(options[0].name);
  const [values, setValues] = useState(initialState);
  const [localAvatarUrl, setLocalAvatarUrl] = useState('');
  const [file, setFile] = useState(null);
  const [localCoverUrl, setLocalCoverUrl] = useState('');
  const [coverFile, setCoverFile] = useState(null);

  // store
  const user = useSelector((store) => store.authentication.user);
  const updateUserPending = useSelector((store) => store.user.updateUserPending);
  const token = useSelector((store) => store.authentication.token);
  const userMedia = useSelector((store) => store.user.userMedia);
  const croppedImage = useSelector((store) => store.croptool.cropped);
  const croppedImageSlung = useSelector((store) => store.croptool.slung);
  const dispatch = useDispatch();

  // effects
  useEffect(async () => {
    if (!user || !user.user_id) {
      return;
    }

    dispatch(getUserMedia());

    setValues({
      fullName: user.full_name,
      description: user.description,
      phoneNumber: user.phone_number,
      genre: (user.genres || []).map((genre) => genres.find((v) => v.value === genre)),
      email: user.email,
      user_type: user.user_type,
      fb: user.facebook_link,
      yt: user.youtube_link,
      instagram: user.instagram_link,
      twitter: user.twitter_link,
    });

    if (user.avatar_url) {
      const res = await handleFetch('GET', `media/presigned-get-url?file_name=${user.avatar_url}`, null, token);
      setLocalAvatarUrl(res.response);
    }

    if (user.cover_url) {
      const res = await handleFetch('GET', `media/presigned-get-url?file_name=${user.cover_url}`, null, token);
      setLocalCoverUrl(res.response);
    }
  }, [user]);

  useEffect(async () => {
    if (!croppedImageSlung) return;
    const file = await fetch(croppedImage).then(res => res.blob());
    const url = await generatePreview(file)
    if (croppedImageSlung == 'cover') {
      setLocalCoverUrl(url);
      setCoverFile(file);
    }
    if (croppedImageSlung == 'avatar') {
      setLocalAvatarUrl(url);
      setFile(file);
    }
  }, [croppedImage, croppedImageSlung])
  
  // handlers
  const handleChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  }

  const handleUpdate = async () => {
    let url = null;
    let coverUrl = null;

    if (file) {
      const res = await dispatch(saveMedia(file));
      url = res.payload;
    }

    if (coverFile) {
      const res = await dispatch(saveMedia(coverFile));
      coverUrl = res.payload;
    }

    const newGenre = [];
    values.genre.forEach((v) => {
      if (!v) {
        return;
      }

      newGenre.push(v.value);
    });

    await dispatch(updateUser({
      id: user.user_id,
      payload: {
        ...user,
        full_name: values.fullName,
        description: values.description,
        phone_number: values.phoneNumber,
        genres: newGenre,
        email: values.email,
        user_type: values.user_type,
        facebook_link: values.fb,
        youtube_link: values.yt,
        instagram_link: values.instagram,
        twitter_link: values.twitter,
        avatar_url: url ? url : user.avatar_url,
        cover_url: coverUrl ? coverUrl : user.cover_url,
      },
    }));

    // userMedia
    userMedia.forEach(async (media) => {
      await dispatch(updateMedia({
        id: media.media_id,
        payload: {
          ...media,
          owner_avatar_url: url ? url : user.avatar_url,
        }
      }));
    });

    // TODO use monitor
  }

  const handleAvatarChange = async (files) => {
    const url = await generatePreview(files[0]);
    dispatch(crop({
      src: url,
      aspectRatio: 1/1,
      width: 100, 
      locked: true,
      slung: 'avatar',
    }));
  }

  const handleCoverChange = async (files) => {
    const url = await generatePreview(files[0]);
    dispatch(crop({
      src: url,
      aspectRatio: 4/1,
      width: 100, 
      locked: true,
      slung: 'cover',
    }))
  }

  // render
  return (
    <div className={styles.container}>
      <div className={styles.heroContainer}>
        <div className={styles.coverWrapper}>
          <AvatarInput
            url={localCoverUrl}
            onChange={handleCoverChange}
          />
        </div>
        <div className={`d-flex ${styles.avatarContainer}`}>
          <div className={styles.avatarWrapper}>
            <AvatarInput
              url={localAvatarUrl}
              onChange={handleAvatarChange}
            />
          </div>
          <div className="d-flex flex-column">
            <p>Mkondo {user.user_type}</p>
            <p className={styles.title}>{user.full_name}</p>
          </div>
        </div>
      </div>

      <Tabs
        options={options}
        onSelect={setSelected}
        selected={selected}
        name="profile"
        activeColor="#EA4C89"
      />

      <div className={`${selected === 'account' ? 'd-block' : 'd-none'}`}>
        <div className="row mt-4">
          {
            menus.map((menu, idx) => (
              <div
                className="col-12 col-sm-6 col-md-4"
                key={`profile-item-menu-${idx}`}
              >
                <InputField
                  field={{
                    ...menu,
                    value: values[menu.name] || '',
                  }}
                  onChange={handleChange}
                />
              </div>
            ))
          }
        </div>
        <div>
          <InputField
            field={{
              ...descriptionField,
              value: values[descriptionField.name] || '',
            }}
            onChange={handleChange}
          />
        </div>
        <div className="row">
          <p className="my-2">Social Media</p>
          {
            socials.map((social, idx) => (
              <div
                className="col-12 col-sm-6 col-md-4"
                key={`social-profile-menu-${idx}`}
              >
                <InputField
                  field={{
                    ...social,
                    value: values[social.name] || '',
                  }}
                  onChange={handleChange}
                />
              </div>
            ))
          }
        </div>
      </div>
      <div className={`${selected === 'songs' ? 'd-block' : 'd-none'} mt-4`}>
        {
          (!userMedia || (userMedia.length < 1 && userMedia.some((_media) => (_media.category == "audio")))) && (
            <p>No Songs available!</p>
          )
        }
        <div className="d-flex flex-wrap justify-content-start">
          {
            userMedia.map((item, index) => {
              if (item.category != 'audio') return;
              return (
                <div className="mb-5  mr-3">
                  <div className="d-flex justify-content-end mb-2">
                    <button className="btn btn-sm btn-text text-light mr-1" onClick={() => {
                      dispatch(showModal('FORM_MODAL', {
                        'noWrapper':true,
                        'preventOutsideClick': true,
                        'form': 'audio-form',
                        'payload': {
                          'mediaId':item.media_id,
                        },
                        
                      }))
                    }}>Edit</button>
                    <button className="btn btn-sm btn-danger"  onClick={() => {
                      dispatch(deleteMedia(item.media_id))
                    }}>Delete</button>
                  </div>
                  <FeatureHome
                    key={`feature-top-songs-${index}`}
                    mediaId={item.media_id}
                    mediaUrl={item.media_url}
                    avatar={item.cover_url}
                    artistId={item.owner_id}
                    owner_name={item.owner_name}
                    title={item.name}
                    description={item.owner_name}
                    country={item.country}
                    category={item.category}
                    showHeader={true}
                    likes={item.likes || undefined}
                    plays={item.plays}
                  />
               </div>
              )
            })
          }
        </div>
      </div>
      <div className={`${selected === 'videos' ? 'd-block' : 'd-none'} mt-4`}>
        {
          (!userMedia || (userMedia.length < 1 && userMedia.some((_media) => (_media.category == "video")))) && (
            <p>No Videos available!</p>
          )
        }
        <div className="d-flex flex-wrap justify-content-start">
          {
            userMedia.map((item, index) => {
              if (item.category != 'video') return;
              return (
               <div className="mb-3 mr-3">
                 <div className="d-flex justify-content-end mb-2">
                    <button className="btn btn-sm btn-text text-light mr-1" onClick={() => {
                      dispatch(showModal('FORM_MODAL', {
                        'noWrapper':true,
                        'preventOutsideClick': true,
                        'form': 'video-form',
                        'payload': {
                          'mediaId':item.media_id,
                        },
                        
                      }))
                    }}>Edit</button>
                    <button className="btn btn-sm btn-danger"  onClick={() => {
                      dispatch(deleteMedia(item.media_id))
                    }}>Delete</button>
                  </div>
                  <FeatureHome
                    key={`feature-top-videos-${index}`}
                    mediaId={item.media_id}
                    mediaUrl={item.media_url}
                    avatar={item.cover_url}
                    artistId={item.owner_id}
                    owner_name={item.owner_name}
                    title={item.name}
                    description={item.owner_name}
                    country={item.country}
                    category={item.category}
                    showHeader={true}
                    likes={item.likes || undefined}
                    plays={item.plays}
                  />
               </div>
              )
            })
          }
        </div>
      </div>
      <div className={`${selected === 'movies' ? 'd-block' : 'd-none'} mt-4`}>
        {
          (!userMedia || (userMedia.length < 1 && userMedia.some((_media) => (_media.category == "movie")))) && (
            <p>No Movies available!</p>
          )
        }
        <div className="d-flex flex-wrap justify-content-start">
          {
            userMedia.map((item, index) => {
              if (item.category != 'movie') return;
              return (
               <div className="mb-3 mr-3">
                 <div className="d-flex justify-content-end mb-2">
                    <button className="btn btn-sm btn-text text-light mr-1" onClick={() => {
                      dispatch(showModal('FORM_MODAL', {
                        'noWrapper':true,
                        'preventOutsideClick': true,
                        'form': 'movie-form',
                        'payload': {
                          'mediaId':item.media_id,
                        },
                      }))
                    }}>Edit</button>
                    <button className="btn btn-sm btn-danger"  onClick={() => {
                      dispatch(deleteMedia(item.media_id))
                    }}>Delete</button>
                  </div>
                  <FeatureHome
                    key={`feature-top-movies-${index}`}
                    mediaId={item.media_id}
                    mediaUrl={item.media_url}
                    avatar={item.cover_url}
                    artistId={item.owner_id}
                    owner_name={item.owner_name}
                    title={item.name}
                    description={item.owner_name}
                    country={item.country}
                    category={item.category}
                    showHeader={true}
                    likes={item.likes || undefined}
                    plays={item.plays}
                  />
               </div>
              )
            })
          }
        </div>
      </div>

      <div className={`mt-4 pt-4 ${selected === 'account' ? 'd-flex' : 'd-none'}`}>
        <Button
          onClick={handleUpdate}
          isLoading={updateUserPending}
        >
          Update
      </Button>
      </div>
    </div>
  );
}

export default Profile;
