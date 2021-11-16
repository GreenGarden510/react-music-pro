import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { selectAllSliders } from '../../../redux/features/slider'
import { AddSliderPictureForm } from '../AddSliderPictureForm'
import styles from '../index.module.scss'
import { SliderPictureList } from '../SliderPictureList'
import { Preview } from './preview'

export const ViewSlider = () => {
    const { slider_id } = useParams()
    const slider = useSelector(selectAllSliders).find(slider => slider.slider_id === slider_id)

    const [preview, setPreview] = useState(false)

    if (!slider) {
        return (
            <div className={`${styles.container}`}>
                <p>Slider not found</p>
            </div>
        )
    }

    return (
        <div className={`${styles.container}`}>
            <div className="d-flex">
                <h1 className="heading-2">{slider.name}</h1>
                <button className="ml-auto btn btn-primary" onClick={() => setPreview(!preview)}>toggle</button>
            </div>
            {preview ? "" : (
                <div className="mt-3">
                    <AddSliderPictureForm slider_id={slider.slider_id} />
                </div>
            )}
            <div className="mt-5">
                {!preview ? <SliderPictureList slider_id={slider.slider_id} /> : <Preview slider_id={slider.slider_id} /> }
            </div>
        </div>
    )
}
