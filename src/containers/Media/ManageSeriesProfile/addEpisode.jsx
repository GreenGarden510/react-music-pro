import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMediaUrl, movieGenres } from '../../../common/utils';
import AvatarInput from '../../../components/common/AvatarInput';
import DonutProgress from '../../../components/common/DonutProgress';
import InputField from '../../../components/forms/InputField';
import styles from './index.module.scss';
import { addMedia, getSeries, saveMediaPro } from '../../../redux/features/media';
import { async } from 'regenerator-runtime';

const initialPayload = {
    name: '',
    release_date: '',
    genres: [],
    description: '',
}

export const AddSeriesEpisode = (props) => {
    //props
    const { episode, onComplete } = props;

    //state
    const [coverUrl, setCoverUrl] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [payload, setPayload] = useState(initialPayload);
    const [submitErrors, setSubmitErrors] = useState({})

    //store
    const dispatch = useDispatch();
    const token = useSelector(state => state.authentication.token);
    const uploadQueue = useSelector(state => state.media.uploadQueue);

    //effects
    useEffect(async () => {
        if (!episode) return;

        //setting cover url
        const _url = await getMediaUrl(episode.cover_url, token);
        setCoverUrl(_url);

        //extend the payload ommiting filename and file
        let _payload = payload; //as initial payload
        Object.keys(episode).map(key => {
            //filtering by key
            if (!['filename', 'file'].includes(key)) {
                _payload[key] = episode[key];
            }
        })

        //starting uploading
        dispatch(saveMediaPro({
            'filename': episode.filename,
            'file': episode.file,
        }));
        setPayload({..._payload});
    }, [episode])

    useEffect(() => {
        if (uploadQueue.some(uploading => uploading.fileName == episode.filename)) {
            const { progress, isUploaded, mediaUrl } = uploadQueue.find(_uploading => _uploading.fileName == episode.filename);
            setProgress(progress);
            if (isUploaded && !uploadComplete) {
                console.log("Upload complete");
                setPayload({...payload, 'media_url': mediaUrl});
                setUploadComplete(true);
            }
        }
    }, [uploadQueue])

    //handlers
    const handleInputChange = (name, value) => {
        if (name in payload) {
            
            if (name == 'genres') {
                console.log(value);
                setPayload({
                    ...payload,
                    'genres': value.map(item => item.value),
                })
                return;
            }

            setPayload({
                ...payload, 
                [name]: value
            })
        }
    }

    const handleSave = async () => {
        const res = await dispatch(addMedia(payload));
        
        if (res.error && res.error.message) {
            const errors = JSON.parse(res.error.message);
            if (errors.description || errors.title || errors.genres || errors.release_date) {
                setSubmitErrors(errors);
            }
            return;
        }

        //reload my series
        dispatch(getSeries());
        setIsOpen(false);
        setTimeout(() => {
            onComplete();
        }, 1000);
        
        //cleanup
        console.log(res);
    }

    return (
        <div className={`${styles.tileCard} ${uploadComplete && styles.uploadComplete}`}>
            <div className={styles.header}>
                <div>
                    <h4>{episode.filename}</h4>
                    {payload.media_url ? (
                        <div className="d-flex align-items-center">
                            <img className="mr-2" src={require('$assets/images/icons/shipping-box-purple.svg')} alt="" height="20px" />
                            <small>{payload.media_url}</small>
                        </div>
                    ): null}
                </div>
                <div className={styles.saveButton}>
                    {/* {!isOpen ? <button onClick={handleSave} className="btn btn-sm btn-primary">Save</button> : null } */}
                </div>
                <div className={styles.progress}>
                    {progress > 0 ? <DonutProgress progress={progress} /> : null}
                </div>
                <div className={styles.iconButton} onClick={() => setIsOpen(!isOpen)}>
                    <img src={require('$assets/images/icons/settings.svg')} alt="" />
                </div>
            </div>
            
            
            <div className={`mt-4 ${styles.body} ${isOpen ? styles.active : ''}`}>
                <div className="row">
                    <div className="col-lg-2">
                        <AvatarInput url={coverUrl} />
                    </div>
                    <div className="col-lg-10">
                        <div className="row">
                            <div className="col-lg-8">
                                <InputField field={{ 
                                    name: 'name',
                                    type: 'text',
                                    placeholder: 'Episode Name',
                                    value: payload.name,
                                    }} error={submitErrors.name} onChange={handleInputChange} />
                            </div>
                            <div className="col-lg-4">
                                <InputField field={{ 
                                    name: 'release_date',
                                    type: 'date',
                                    placeholder: 'Release Date',
                                    value: payload.release_date,
                                    }} error={submitErrors.release_date} onChange={handleInputChange} />
                            </div>
                            <div className="col-lg-12">
                                <InputField field={{ 
                                    name: 'genres',
                                    type: 'select',
                                    options: movieGenres,
                                    placeholder: 'Choose Genres',
                                    value: movieGenres.filter(genre => payload.genres.includes(genre.value)),
                                    isMulti: true,
                                    }} error={submitErrors.genres} onChange={handleInputChange} />
                            </div>
                            <div className="col-lg-12">
                                <InputField field={{ 
                                    name: 'description',
                                    type: 'area',
                                    placeholder: 'Describe the episode.',
                                    value: payload.description,
                                    }} error={submitErrors.description} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-auto ml-auto">
                                <button onClick={handleSave} className="btn btn-lg btn-primary">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
