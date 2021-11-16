import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleFetch } from '../../../../common/requestUtils';
import { generatePreview, genres, movieGenres } from '../../../../common/utils';
import { saveMedia, updateMedia } from '../../../../redux/features/media';
import AvatarInput from '../../../common/AvatarInput';
import InputField from '../../../forms/InputField';
import styles from '../index.module.scss'

const initialState = {
    name: '',
    description: '',
    genres:'',
    cover_url: '',
    production_company: '',
    movie_director: '',
    staring: '',
    release_date: '',
}

export const VideoForm = (props) => {
    //state
    const [bannerUrl, setBannerUrl] = useState('')
    const [bannerImage, setBannerImage] = useState(null)
    const [values, setValues] = useState(initialState)

    //props
    const { payload, closeModal } = props;
    const { mediaId } = payload;

    //store
    const dispatch = useDispatch();

    const video = useSelector((state) => state.user.userMedia.filter((media) => media.media_id == mediaId)[0])
    const token = useSelector((state) => state.authentication.token)
    const submitting = useSelector((state) => state.media.updateMediaPending)

    useEffect(async () => {
        if (!video) return;
        console.log("Performing instantiation", video)
        let payload = initialState;
        for (const field in initialState) {
            console.log(field)
            if (field in video) {
                console.log(`${field} has been detected with value: `, video[field])
                payload[field] = video[field]
            }
        }
        setValues(payload);

        const res = await handleFetch('GET', `media/presigned-get-url?file_name=${video.cover_url}`, null, token);
        setBannerUrl(res.response);
    }, [video])

    const handleChange = (name, value) => {
        console.log('Handle change called: ', name, value)
        if (name in values) {
            if (name === 'genres') {
                setValues({...values, 'genres': value.map((val) => val.value)})
                return;
            }
            setValues({...values, [name]: value});
        }
    }

    const handleUpdate = async () => {
        //handle upload
        let payload = values;
        if (bannerImage) {
            let response = await dispatch(saveMedia(bannerImage))
            payload['cover_url'] = response.payload
        }
        
        dispatch(updateMedia({
            id: video.media_id,
            payload: payload,
        }));
    }

    const handleFileChange = async (files) => {
        let url = await generatePreview(files[0])
        setBannerUrl(url);
        setBannerImage(files[0]);
    }

    return (
        <div className={styles.card}>
            <h2>Update {video['category']}</h2>
            <div className="row">
                <div className={styles.bannerWrapper}>
                    <AvatarInput url={bannerUrl} onChange={handleFileChange} />
                </div>
            </div>
            <div className="row mt-2">
                { Object.keys(videoFormFields).map((field) => {
                    if (['description'].includes(field)) return;
                    if (field == 'genres') {
                        return (
                            <div className="col-lg-6">
                                <InputField field={{ ...videoFormFields[field], isMulti:true, value: genres.filter((genre) => values.genres.includes(genre.value)) }} onChange={handleChange} />
                            </div>
                        )
                    }

                    return (
                        <div className="col-lg-6">
                            <InputField field={{ ...videoFormFields[field], value: values[field] }} onChange={handleChange} />
                        </div>
                    )
                }) }
            </div>

            <div className="row my-2">
                <div className="col">
                    <InputField field={{ ...videoFormFields.description, value: values['description'] }} onChange={handleChange} />
                </div>
            </div>
            <div className="row">
                <div className="col-md-auto ml-auto">
                    <button className="btn btn-lg btn-primary mr-2" onClick={handleUpdate} disabled={submitting}>Update {submitting && <span className="spinner-border"></span>}</button>
                    <button className="btn btn-lg btn-outline-primary" onClick={closeModal}>Close</button>
                </div>
            </div>
        </div>
    )
}

export const videoFormFields = {
    name: { name: 'name', type: 'text', placeholder: 'Title', title: 'Title' },
    genres: { name: 'genres', type: 'select', placeholder: 'Choose Genres', title: 'Genres', options: genres },
    description: { name: 'description', type: 'area', placeholder: 'Describe your media', title: 'Description' },
    production_company: { name: 'production_company', type: 'text', placeholder: 'Production Company', title: 'Production Company' },
    movie_director: { name: 'movie_director', type: 'text', placeholder: 'Movie Director', title: 'Director' },
    staring: { name: 'staring', type: 'text', placeholder: 'Cast Names', title: 'Cast' },
    release_date: { name: 'release_date', type: 'date', placeholder: 'Release Date', title: 'Release Date' },
}
