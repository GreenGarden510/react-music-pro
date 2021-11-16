import { unwrapResult } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { routePaths } from '../../../common/routeConfig'
import Button from '../../../components/common/Button'
import InputField from '../../../components/forms/InputField'
import { selectAllSliders, storeSlider, updateSlider } from '../../../redux/features/slider'
import { aspectRatioXField, aspectRatioYField } from '../AddSliderForm'
import styles from '../index.module.scss'

const nameField = {
    type: "text",
    name: "name",
    placeholder: "Slider Name"
}

const initialState = {
    name: ""
}

export const EditSliderForm = () => {
    const { slider_id } = useParams()
    const sliders = useSelector(selectAllSliders)
    const slider = sliders.find(slider => slider.slider_id === slider_id)
    const [values, setValues] = useState(slider)
    const [submitting, setSubmitting] = useState(false)

    const history = useHistory()
    const dispatch = useDispatch()

    // handlers
    const handleChange = (name, value) => {
        setValues({
            ...values,
            [name]: value,
        });
    }

    const handleUpdate = async () => {
        try {
            setSubmitting(true)
            const action = await dispatch(updateSlider({
                id: slider_id,
                values: values
            }))
            unwrapResult(action)
            history.push(routePaths.slider)
        } catch (err) {
            console.error("Failed to update the slider", err)
        } finally {
            setSubmitting(false)
        }
    }

    if (!slider_id) {
        return <div>Slider not found</div>
    }

    return (
        <div className={`${styles.container}`}>
            <div className="col-lg-auto"><h1 className="heading-2">Update Slider</h1></div>
            <div className="row">
                <div className="col-lg-6">
                    <InputField field={{ ...nameField, value: values[nameField.name] }} onChange={handleChange} />
                </div>
                <div className="col-lg-3">
                    <InputField field={{ ...aspectRatioXField, value: values[aspectRatioXField.name] }} onChange={handleChange} />
                </div>
                <div className="col-lg-3">
                    <InputField field={{ ...aspectRatioYField, value: values[aspectRatioYField.name] }} onChange={handleChange} />
                </div>
            </div>
            <Button onClick={handleUpdate} isLoading={submitting}>Update Slider</Button>
        </div>
    )
}
