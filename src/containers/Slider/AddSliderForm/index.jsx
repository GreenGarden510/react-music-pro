import { unwrapResult } from '@reduxjs/toolkit'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { routePaths } from '../../../common/routeConfig'
import Button from '../../../components/common/Button'
import InputField from '../../../components/forms/InputField'
import { storeSlider } from '../../../redux/features/slider'
import styles from '../index.module.scss'

const nameField = {
    type: "text",
    name: "name",
    placeholder: "Slider Name"
}

export const aspectRatioXField = {
    type: "number",
    name: "aspect_ratio_x",
    placeholder: "Horizontal Scale"
}

export const aspectRatioYField = {
    type: "number",
    name: "aspect_ratio_y",
    placeholder: "Vertical Scale"
}

const initialState = {
    name: ""
}

export const AddSliderForm = () => {
    const [values, setValues] = useState(initialState)
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

    const handleStore = async () => {
        try {
            setSubmitting(true)
            const action = await dispatch(storeSlider(values))
            unwrapResult(action)
            history.push(routePaths.slider)
        } catch (err) {
            console.error("Failed to save the slider", err)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={`${styles.container}`}>
            <div className="col-lg-auto"><h1 className="heading-2">Add Slider</h1></div>
            <div className="row">
                <div className="col-lg-6">
                    <InputField field={{ ...nameField, value: values[nameField.name] }} onChange={handleChange} />
                </div>
                <div className="col-lg-3">
                    <InputField field={{ ...aspectRatioXField, value: values[aspectRatioXField.name]  }} onChange={handleChange} />
                </div>
                <div className="col-lg-3">
                    <InputField field={{ ...aspectRatioYField, value: values[aspectRatioYField.name]  }} onChange={handleChange} />
                </div>
            </div>
            <Button onClick={handleStore} isLoading={submitting}>Add Slider</Button>
        </div>
    )
}
