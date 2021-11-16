import { unwrapResult } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchConfigurations, selectConfigurationByKey, selectConfigurations, storeConfiguration, updateConfiguration } from '../../../redux/features/configuration'
import slider, { fetchSliders, selectAllSliders } from '../../../redux/features/slider'

export const CONFIG_KEY_HOME_SLIDER = "HOME_SLIDER"

export const Form = () => {
    const [payload, setPayload] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const slider = useSelector(state => state.slider)
    const configuration = useSelector(state => state.configuration)
    const home_slider_setting = useSelector(state => selectConfigurationByKey(state, CONFIG_KEY_HOME_SLIDER))
    
    const dispatch = useDispatch()

    useEffect(() => {
        if (!slider.data.length && slider.status === 'idle') {
            dispatch(fetchSliders())
        }
    }, [slider])

    useEffect(() => {
        if (configuration.status === 'idle') {
            dispatch(fetchConfigurations())
        }
    }, [configuration])

    useEffect(() => {
        if (home_slider_setting) {
            setPayload(home_slider_setting.value)
        }
    }, [home_slider_setting])

    const handleChange = e => setPayload(e.target.value)

    const handleSave = async () => {
        setSubmitting(false)
        try {
            if (home_slider_setting) {
                // the configuration already exists so update it
                const _payload = {
                    id: home_slider_setting.configuration_id,
                    data: {
                        value: payload
                    }
                }
                const resultAction = await unwrapResult(dispatch(updateConfiguration(_payload)))
            } else {
                // the configuration does not exist so create it
                const _payload = {
                    key: CONFIG_KEY_HOME_SLIDER,
                    value: payload
                }
                const resultActon = await unwrapResult(dispatch(storeConfiguration(_payload)))
            }
        } catch (error) {
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="row">
            <div className="col">
                <h4>Home Slider</h4>
            </div>
            <div className="col">
                {home_slider_setting ? <span>Setting Found</span> : <span>Unknown</span>}
            </div>
            <div className="col">
                <p>Select Slider</p>
                {slider.status === 'loading' ? <p>Loading...</p> : (
                    <select value={payload} onChange={handleChange}>
                        <option value="">Choose...</option>
                        {slider.data.map(item => <option key={item.slider_id} value={item.slider_id}>{item.name}</option>)}
                    </select>
                )}
            </div>
            <div className="col">
                <button onClick={handleSave} disabled={submitting}>Save</button>
            </div>
        </div>
    )
}
