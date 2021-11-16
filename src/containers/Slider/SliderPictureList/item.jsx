import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { handleFetch } from '../../../common/requestUtils';
import { deleteSliderItem } from '../../../redux/features/slider';

export const Item = ({ key, item }) => {
    const { token } = useSelector(state => state.authentication)

    const [image, setImage] = useState(null)
    const [deleting, setDeleting] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        handleFetch('GET', `media/presigned-get-url?file_name=${item.image_url}`, null, token)
            .then((res) => setImage(res.response));
    }, [item])

    const handleDelete = async () => {
        setDeleting(true)
        try {
            const resultAction = await dispatch(deleteSliderItem(item))
            unwrapResult(resultAction)
        } catch (error) {
            console.error(error)
        } finally {
            setDeleting(false)
        }
        
    }

    return (
        <div key={key}>
            {deleting ? <p>Deleting...</p> : <button onClick={handleDelete}>delete</button>}
            <img src={image} alt="" width="100%" />
        </div>
    )
}
