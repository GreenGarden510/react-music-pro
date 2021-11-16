import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styles from './index.module.scss'

export const Tile = () => {

    const { pathname } = useLocation()
    const { push } = useHistory()
    
    return (
        <div className={`${styles.tile}`} onClick={() => push(`${pathname}/sliders`)}>
            <h2>Slider Settings</h2>
        </div>
    )
}
