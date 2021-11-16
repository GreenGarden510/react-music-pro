import React from 'react'
import styles from './index.module.scss'
import { List } from './list'

export const Menu = () => {
    return (
        <div className={`${styles.container}`}>
            <h1>Settings</h1>
            
            <div>
                <List />
            </div>
        </div>
    )
}
