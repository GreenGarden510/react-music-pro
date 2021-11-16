import React, { useEffect, useState } from 'react'
import AvatarInput from '../../../common/AvatarInput'
import InputField from '../../../forms/InputField'
import styles from './../index.module.scss'
import { generatePreview, genres } from '../../../../common/utils';
import { metamenus } from '../../../../containers/Media/NewMedia/menus';
import { Button } from 'react-aria-menubutton';
import { useDispatch, useSelector } from 'react-redux';
import { handleFetch } from '../../../../common/requestUtils';
import { updateMedia } from '$redux/features/media';
import { async } from 'regenerator-runtime';
import { saveMedia } from '../../../../redux/features/media';

const initialState = {
    name: '',
    genres: '',
    description: '',
    policy: false,
    record_label: '',
    song_writer: '',
    composer: '',
    file: '',
    publisher: '',
    release_date: '',
  }

export const AudioForm = (props) => {
    //state
    const [coverUrl, setCoverUrl] = useState('')
    const [values, setValues] = useState(initialState)
    const [coverImage, setCoverImage] = useState(null)

    //props
    const { payload, closeModal } = props;
    const { mediaId } = payload;

    //store
    const dispatch = useDispatch();

    const audio = useSelector((state) => state.user.userMedia.filter((media) => media.media_id == mediaId)[0])
    const token = useSelector((state) => state.authentication.token)
    const submitting = useSelector((state) => state.media.updateMediaPending)


    useEffect(async () => {
        if (!audio) return;
        console.log("Performing instantiation", audio)
        let payload = initialState;
        for (const field in initialState) {
            console.log(field)
            if (field in audio) {
                console.log(`${field} has been detected with value: `, audio[field])
                payload[field] = audio[field]
            }
        }
        setValues(payload);

        const res = await handleFetch('GET', `media/presigned-get-url?file_name=${audio.cover_url}`, null, token);
        setCoverUrl(res.response);
    }, [audio]);

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
        if (coverImage) {
            let response = await dispatch(saveMedia(coverImage))
            payload['cover_url'] = response.payload
        }
        
        dispatch(updateMedia({
            id: audio.media_id,
            payload: payload,
        }));
    }

    const handleFileChange = async (files) => {
        let url = await generatePreview(files[0])
        setCoverUrl(url);
        setCoverImage(files[0]);
    }

    return (
        <div>
            <div className={styles.card}>
                <h2 className="text-light">Update Song</h2>
                
                <div className="row mt-4">
                    <div className="col-md-4">
                        <div className={styles.avatarInputWrapper}>
                            <AvatarInput url={coverUrl} onChange={handleFileChange} />
                        </div>
                    </div>
                    <div className="col-md-8">
                        <InputField field={{ 
                            name:'name',
                            type:'text',
                            placeholder: 'Audio Name',
                            title: 'Name',
                            value: values.name,
                         }} onChange={handleChange} />
                        <InputField field={{ 
                            name:'genres',
                            type:'select',
                            placeholder:'Select Genre',
                            title:'Genre',
                            options: genres,
                            isMulti:true,
                            value: genres.filter((genre) => values.genres.includes(genre.value))
                         }} onChange={handleChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <InputField
                            field={{ 
                                name:'description',
                                type:'area',
                                placeholder:'Describe the audio',
                                title:'Description',
                                value: values.description
                             }}
                             onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="row">
                    {audiometa.map((meta) => (
                        <div className="col-md-4">
                            <InputField field={{ ...meta, value: values[meta.name] }} onChange={handleChange} />
                        </div>
                    ))}
                </div>
                <div className="row">
                    <div className="col-md-auto ml-auto">
                            <button className="btn btn-lg btn-primary mr-2" onClick={handleUpdate} disabled={submitting}>Update {submitting && <span className="spinner-border"></span>}</button>
                            <button className="btn btn-lg btn-outline-primary" onClick={closeModal}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const audiometa = [
    { name: 'composer', type: 'text', placeholder: 'composer_name', title: 'composer' },
    { name: 'release_date', type: 'date', placeholder: 'release_date', title: 'release_date' },
    { name: 'song_writer', type: 'text', placeholder: 'enter_song_writer', title: 'song_writer(s)' },
    { name: 'record_label', type: 'text', placeholder: 'enter_record_label', title: 'record_label' },
];