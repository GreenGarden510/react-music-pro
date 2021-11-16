import React, { useEffect, useRef, useState } from 'react';
import AvatarInput from '../../../components/common/AvatarInput';
import InputField from '../../../components/forms/InputField';
import styles from './index.module.scss';
import { movieGenres } from '$common/utils';
import { generatePreview } from '../../../common/utils';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { async } from 'regenerator-runtime';
import { addSeries, saveMediaPro } from '../../../redux/features/media';
import DonutProgress from '../../../components/common/DonutProgress/index';
import { generatePath, useHistory } from 'react-router-dom';
import { routePaths } from '../../../common/routeConfig';

const initialPayload = {
    'owner_id': '',
    'title': null,
    'genres': [],
    'description': '',
    'cover_url': '',
    'trailer_url': '',
}

const initialErrors = {
    title: null,
    description: null,
    genres: null,
}

const BackgroundImage = styled.div`
    background-image: ${(props) => props.image ? `URL('${props.image}')` : 'inherit'};
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
`;

export const NewSeries = () => {
    //hooks
    const { push } = useHistory()

    // refs
    const coverRef = useRef(null);
    const trailerRef = useRef(null);

    //state
    const [payload, setPayload] = useState(initialPayload)
    const [genresValues, setGenresValues] = useState([])
    const [coverPreview, setCoverPreview] = useState(null)
    const [trailerFile, setTrailerFile] = useState(null)
    const [coverFileName, setCoverFileName] = useState(null);
    const [trailerFileName, setTrailerFileName] = useState(null);
    const [coverFileProgress, setCoverFileProgress] = useState(0);
    const [trailerFileProgress, setTrailerFileProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState(initialErrors)


    //store
    const dispatch = useDispatch();
    const token = useSelector(state => state.authentication.token);
    const userId = useSelector(state => state.authentication.user.user_id);
    const addSeriesPending = useSelector(state => state.media.addSeriesPending);
    const addSeriesSuccess = useSelector(state => state.media.addSeriesSuccess);
    const addSeriesError = useSelector(state => state.media.addSeriesError);
    const uploadQueue = useSelector(state => state.media.uploadQueue);

    //effects
    useEffect(() => {
        if (!userId) return;
        setPayload({...payload, owner_id: userId});
    }, [userId]);

    // useEffect(() => {
    //     //navigate to manage series page
    //     if (!addSeriesSuccess) return;

    //     //cleanup

    //     //navigate to manage series page
    //     // push(generatePath(routePaths.manageSeries, { series_id:  }))
    // }, [addSeriesSuccess]);

    useEffect(() => {
        setFieldErrors(initialErrors);
        if (!addSeriesError) return;
        //display errors
        //error structure to purse addSeriesError is Null or {message: jsonString}
        //get the message and parse the jsonString and look for fields of interest
        const message = addSeriesError.message;
        try {
            const json = JSON.parse(message)
            let _errors;
            if (json.message) {
                _errors = json.message;
            } else {
                _errors = json;
            }
            if (typeof _errors == 'object') {
                if ('title' in _errors) {
                    setFieldErrors({...fieldErrors, title: 'Series must have a valid title'});
                }
                if ('description' in _errors) {
                    setFieldErrors({...fieldErrors, description: 'Series must have a valid description'});
                }
                if ('genres' in _errors) {
                    setFieldErrors({...fieldErrors, genres: 'Series must have a valid genre'})
                }
            }
        } catch (e) {
            console.error(e)
        }
    }, [addSeriesError]);

    useEffect(() => {
        setIsLoading(addSeriesPending);
    }, [addSeriesPending]);

    // useEffect(() => {
    //     if (!addSeriesSuccess) return;
    //     // push(generatePath(routePaths.manageSeries, {series_id: }));
    // }, [addSeriesSuccess]);

    useEffect(() => {
        // console.log("Effect", uploadQueue, coverFileName, trailerFileName);
        if (!uploadQueue) return;
        // console.log(uploadQueue);
        uploadQueue.map((uploading) => {
            // console.log(uploading.fileName, coverFileName, trailerFileName);
            if (coverFileName && coverFileName === uploading.fileName) {
                setCoverFileProgress(uploading.progress)
            }
            if (trailerFileName && trailerFileName === uploading.fileName) {
                setTrailerFileProgress(uploading.progress);
            }
        })
    }, [uploadQueue, coverFileName, trailerFileName]);

    //handles
    const handleCoverChange = async (e) => {
        const url = await generatePreview(coverRef.current.files[0]);
        setCoverPreview(url);

        if (coverRef.current.files[0].name) {
            setCoverFileName(coverRef.current.files[0].name);
            setIsLoading(true);
            const res = await dispatch(saveMediaPro({
                'filename': coverRef.current.files[0].name,
                'file': coverRef.current.files[0],
            }));
            setIsLoading(false);
            handleInputChange('cover_url', res.payload);
        }
    }

    const handleTrailerChange = async (e) => {
        setTrailerFile(null)
        const url = await generatePreview(trailerRef.current.files[0]);
        setTrailerFile(url);

        //Cancel any previous ongoing fileuploads of the previoous file
        //start new upload
        if (trailerRef.current.files[0].name) {
            setTrailerFileName(trailerRef.current.files[0].name);
            setIsLoading(true);
            const res = await dispatch(saveMediaPro({
                'filename': trailerRef.current.files[0].name,
                'file': trailerRef.current.files[0],
            }));
            setIsLoading(false);
            handleInputChange('trailer_url', res.payload);
        }
    }

    const handleInputChange = (name, value) => {
        if (name in payload) {
            if (['genres'].includes(name)) {
                console.log(value);
                setGenresValues(value);
                setPayload({...payload, 'genres': value.map(item => item.value)});
                return;
            }
            setPayload({...payload, [name]: value});
        }
    }

    const handleSaveSeries = async () => {
        // save the series
        const action = await dispatch(addSeries(payload));
        if (action.payload) {
            push(generatePath(routePaths.manageSeries, {series_id: action.payload.series.series_id}));
        }
        // console.log(res)
    }

    return (
        <div className="container pt-5">
            <div className="row mt-5">
                <div className="col">
                    {/* <button className="btn btn-primary mb-3" onClick={() => push(routePaths.newMediaCategory)}>Back</button> */}
                    <h1 className="text-light">Add New Series</h1>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-4 col-lg-2 p-0 pl-3 pr-1">
                    <BackgroundImage image={coverPreview} onClick={() => coverRef.current.click()} className={`${styles.uploadCover} d-flex flex-column justify-content-center h-100 align-items-center`}>
                            <img src={require("$assets/images/icons/upload.svg")} alt=""  />
                            <p className="lead text-light">Upload Cover</p>
                            {coverFileProgress > 0 && <p><DonutProgress progress={coverFileProgress} height={30} width={30} /></p>}
                            <input
                                className="d-none"
                                type="file"
                                ref={coverRef}
                                accept="image/*"
                                onChange={handleCoverChange}
                            />
                    </BackgroundImage>
                    
                </div>
                <div className="col-8 col-lg-4 p-0 pl-1 pr-3">
                    <div onClick={() => trailerRef.current.click()} className={`${styles.uploadTrailer} ${trailerFile && styles.active} d-flex flex-column justify-content-center h-100 align-items-center`}>
                            {trailerFile && (
                                <video width="100%" height="100%" autoPlay>
                                    <source src={trailerFile} />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                            <img src={require("$assets/images/icons/upload.svg")} alt=""  />
                            <p className="lead text-light">Upload Trailer</p>
                            {trailerFileProgress > 0 && <p><DonutProgress progress={trailerFileProgress} height={30} width={30} /></p>}
                            <input
                                className="d-none"
                                type="file"
                                ref={trailerRef}
                                accept="video/*"
                                onChange={handleTrailerChange}
                            />
                    </div>
                </div>
                <div className="col-lg-6">
                    <InputField field={{ 
                        type: "text",
                        name: "title",
                        title: "Title",
                        placeholder: "Series Title",
                        value: payload['title'],
                    }} error={fieldErrors.title} onChange={handleInputChange} />
                    <InputField field={{ 
                        name: 'genres',
                        type: 'select',
                        placeholder: 'Enter Genre',
                        title: 'Genre',
                        options: movieGenres,
                        isMulti: true,
                        value: genresValues,
                     }} error={fieldErrors.genres}  onChange={handleInputChange} />
                    <InputField field={{ 
                        type: "area", 
                        name: "description",
                        title: "Description", 
                        placeholder: "Brief about the series you are uploading.",
                        value: payload['description'],
                    }}  onChange={handleInputChange} error={fieldErrors.description} isGrey={true} />
                </div>

            </div>
            <div className="row my-3">
                <div className="col-lg-4 ml-auto">
                    <button onClick={handleSaveSeries} className="btn btn-lg btn-primary w-100" disabled={isLoading}>Save and Next {isLoading && <span className="spinner-border text-light"></span>}</button>
                </div>
            </div>
        </div>
    )
}
