import React from 'react'
import { Form } from './form'
import styles from './index.module.scss'

export const Sliders = () => {
    return (
        <div className={`${styles.container}`}>
            <h3>Slider Settings</h3>
            
            <Form />
        </div>
    )
}
