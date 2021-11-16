import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import styles from './index.module.scss';
import { COLOR_PRIMARY } from '../../../../common/constants';
import { useDispatch, useSelector } from 'react-redux';
import AvatarInput from '../../../common/AvatarInput/index';
import { generatePreview } from '../../../../common/utils';
import DragDrop from '../../../common/DragDrop';
import { saveMedia } from '../../../../redux/features/media';
import { addPost } from '../../../../redux/features/post';
import { generatePath } from 'react-router-dom';
//styled models
const Background = styled.div`
    position: fixed;
    background: rgba(0,0,0, 0.8);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`;

const Modal = styled.div`
    background: #111111;
    width: 50%;
    border-radius: 10px 10px 0 0;
    border-bottom: solid 5px ${COLOR_PRIMARY};
    overflow-y: auto;

    @media (max-width: 992px) {
        width: 90%;
        top: 5%;
        height: 90%;
     }
`;

//initialState
const postInitial = {
    "user_id": "",
    "caption": "",
    "content": "",
    "description": "",
    "featured_image_url": "",
    "featured_video_url": "",
    "featured_audio_url": "",
    "images": [],
    "videos": [],
}

const modes = ["INITIAL", "PICTURES", "VIDEOS", "LOCATION", "GIF", "TAG", "LIVE"];

export const SocialMediaCreatePost = () => {
    //state
    const [activeMode, setActiveMode] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [payload, setPayload] = useState(postInitial);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videos, setVideos] = useState([]);
    const [videoPreviews, setVideoPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    //store
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.authentication.user.user_id);
    const addPostPending = useSelector((state) => state.post.addPostPending);
    const saveMediaPending = useSelector((state) => state.post.saveMediaPending);
    const addPostSuccess = useSelector((state) => state.post.addPostSuccess);

    //effects
    useEffect(() => {
        if (!userId) return;
        setPayload({
            ...payload, 
            "user_id": userId
        });
    }, [userId]);

    useEffect(() => {
        if (!addPostSuccess) return;
        setPayload(postInitial);
        setImages([]);
        setShowForm(false);
    }, [addPostSuccess]);

    useEffect(() => {
        if (addPostPending || saveMediaPending) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [addPostPending, saveMediaPending]);

    const handleChange = (name, value) => {
        if (payload.hasOwnProperty(name)) {
            setPayload({ 
                ...payload, 
                [name]: value 
            });
        }
    }

    const handleImageChange = async (files) => {
        setImages(files);
        let urls = [];
        for (var i = 0; i < files.length; i++) {
            let url = await generatePreview(files[i]);
            urls.push(url);
        }
        setImagePreviews(urls);
    }

    const handleVideoChange = async (files) => {
        setVideos(files);
        let urls = [];
        for (var i = 0; i < files.length; i++) {
            let url = await generatePreview(files[i]);
            urls.push(url);
        }
        setVideoPreviews(urls);
    }

    const handlePublish = async () => {
        //saving the post
        // uploading the images
        let _images = [];
        if (images.length) {
            for (let i = 0; i < images.length; i++) {
                const { payload: url} = await dispatch(saveMedia(images[i]));
                _images.push({
                    url,
                    caption: '',
                });
            }
        }
        
        let _videos = [];
        if (videos.length) {
            for (let j = 0; j < videos.length; j++) {
                console.log("Uploading video no ", j)
                const { payload: _url } = await dispatch(saveMedia(videos[j]));
                console.log("Response url: ", _url);
                _videos.push({
                    url: _url,
                    caption: '',
                })
                console.log(_videos);
            }
        }

        console.log("Videos, ", _videos);

        dispatch(addPost(
            { ...payload, 
                "images": _images,
                "videos": _videos,
            }));
    }

    return (
        <div className={`${styles.wrapper} p-5`}>
            <h3 className="mb-4">Create New Post</h3>
            <div className={`d-flex ${styles.input}`}>
                <img src={require('$assets/images/icons/pen.svg')} alt="" height="20px" />
                <input type="text" className="ml-3 w-100" placeholder="Create Post" onFocus={() => setShowForm(true)} />
            </div>
            {showForm && (
                <>
                    <Background className="d-flex align-items-center justify-content-center">
                        <Modal>
                            <div className="m-4">
                                <div className={`d-flex align-items-center pb-2 mb-4 ${styles.createPostHeader}`}>
                                    <img className="mr-3" src={require("$assets/images/icons/plus.svg")} alt="" height="20px" />
                                    <h3 className="m-0">Create New Post</h3>
                                    <img className="ml-auto" src={require("$assets/images/icons/close.svg")} alt="" height="20px" onClick={() => setShowForm(false)} />
                                </div>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className={`row ${styles.pills}`}>
                                            <div className="col-6 mb-2">
                                                <div onClick={() => setActiveMode(1)} className={`d-flex align-items-center py-1 px-3 ${styles.iconPill}  ${modes[activeMode] == "PICTURES" ? styles.active : ''}`}>
                                                    <img src={require("$assets/images/icons/camera.svg")} alt="" height="12"  />
                                                    <span className="ml-2">Pictures</span>
                                                </div>
                                            </div>
                                            <div className="col-6 mb-2">
                                                <div onClick={() => setActiveMode(2)} className={`d-flex align-items-center py-1 px-3 ${styles.iconPill}  ${modes[activeMode] == "VIDEOS" ? styles.active : ''}`}>
                                                    <img src={require("$assets/images/icons/video-camera.svg")} alt="" height="12"  />
                                                    <span className="ml-2">Vidoes</span>
                                                </div>
                                            </div>
                                            <div className="col-6 mb-2">
                                                <div onClick={() => setActiveMode(3)}  className={`d-flex align-items-center py-1 px-3 ${styles.iconPill}  ${modes[activeMode] == "LOCATION" ? styles.active : ''}`}>
                                                    <img src={require("$assets/images/icons/location.svg")} alt="" height="12"  />
                                                    <span className="ml-2">Location</span>
                                                </div>
                                            </div>

                                            <div className="col-6 mb-2">
                                                <div onClick={() => setActiveMode(4)}  className={`d-flex align-items-center py-1 px-3 ${styles.iconPill}  ${modes[activeMode] == "GIF" ? styles.active : ''}`}>
                                                    <img src={require("$assets/images/icons/image.svg")} alt="" height="12"  />
                                                    <span className="ml-2">Post GIF</span>
                                                </div>
                                            </div>

                                            <div className="col-6">
                                                <div onClick={() => setActiveMode(5)}  className={`d-flex align-items-center py-1 px-3 ${styles.iconPill}  ${modes[activeMode] == "TAG" ? styles.active : ''}`}>
                                                    <img src={require("$assets/images/icons/tag-user.svg")} alt="" height="12"  />
                                                    <span className="ml-2">Tag Friends</span>
                                                </div>
                                            </div>

                                            <div className="col-6">
                                                <div onClick={() => setActiveMode(6)} className={`d-flex align-items-center py-1 px-3 ${styles.iconPill}  ${modes[activeMode] == "LIVE" ? styles.active : ''}`}>
                                                    <img src={require("$assets/images/icons/video-camera.svg")} alt="" height="12"  />
                                                    <span className="ml-2">Go Live</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <textarea 
                                            onChange={(e) => handleChange("content", e.target.value)}
                                            className={styles.inputBase} 
                                            rows="5" placeholder="Whats on your mind?" value={payload["content"]}></textarea>
                                    </div>
                                </div>
                                {modes[activeMode] == 'PICTURES' && (
                                    <div className="mt-3" style={{ minHeight: 200 }}>
                                        {!images.length ? <DragDrop onChange={(files) => handleImageChange(files)} isMulti={true} acceptedFiles="image/*" /> : (
                                            <div>
                                                {imagePreviews.map((preview) => <img src={preview} height="150"></img>)}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {modes[activeMode] == 'VIDEOS' && (
                                    <div className="mt-3" style={{ minHeight: 200 }}>
                                        {!videos.length ? <DragDrop onChange={(files) => handleVideoChange(files)} isMulti={true} acceptedFiles="video/*" /> : (
                                            <div>
                                                <h5 className="text-light">Previews</h5>
                                                {videoPreviews.map((preview) => <video src={preview} height="150px" controls></video>)}
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="row mt-3">
                                    <div className="col-lg-12">
                                        <button onClick={() => handlePublish()} className="btn btn-primary w-100" disabled={isLoading}>Publish {isLoading && <span className="spinner-border"></span>}</button>
                                    </div>
                                </div>
                            </div>
                        </Modal>
                    </Background>
                </>
            )}
        </div>
    )
}
