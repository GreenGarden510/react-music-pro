import { unwrapResult } from '@reduxjs/toolkit'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generatePreview } from '../../../common/utils'
import Button from '../../../components/common/Button'
import { CroppingTool } from '../../../components/common/CroppingTool'
import { saveMedia } from '../../../redux/features/media'
import { selectSliderById, storeSliderItem } from '../../../redux/features/slider'
import styles from './index.module.scss'

export const AddSliderPictureForm = ({ slider_id }) => {
    const [image, setImage] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    
    const slider = useSelector(state => selectSliderById(state, slider_id))

    const dispatch = useDispatch()

    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        setImage(file)
        
        //generate a preview
        const url = await generatePreview(file);
        setPreviewUrl(url)
    }

    const handleUpload = async () => {
        setSubmitting(true)

        const uploadResponse = await dispatch(saveMedia(image))
        
        const payload = {
            'slider_id': slider_id,
            'image_url': uploadResponse.payload
        }
        
        try {
            const reduxAction = await dispatch(storeSliderItem(payload))
            unwrapResult(reduxAction)
            setPreviewUrl("")
        } catch (error) {
            console.log("Failed to add slider item", error)
        } finally {
            setSubmitting(false)
            setImage(null)
            setPreviewUrl(null)
        }
    }

    const handleCancel = () => {
        setImage(null)
        setPreviewUrl(null)
    }

    return (
        <div className={`row ${styles.uploadCard}`}>
            <div className="col-lg">
                {!image ? (
                    <React.Fragment>
                        <h4>Upload Slider Image</h4>
                        <input type="file" value="" onChange={handleImageChange}/>
                        {submitting ? <p>Submitting...</p> : ""}
                    </React.Fragment>
                ) : (
                    <div>
                        {previewUrl && (
                            <CroppingTool src={previewUrl} aspectRatio={slider.aspect_ratio_x/slider.aspect_ratio_y} width={100} locked={false} onChange={(cropped) => {
                                setImage(cropped)
                            }} />
                        )}
                        <div className="d-flex mt-2">
                            <Button onClick={handleUpload}>Upload</Button>
                            <div>&nbsp;&nbsp;&nbsp;</div>
                            <Button isTransparent={true} onClick={handleCancel}>Cancel</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
