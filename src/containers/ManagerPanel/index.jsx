import React from 'react'
import styles from './index.module.scss';

export const ManagerPanel = () => {
    return (
        <div className={`${styles.container} container`}>
            <h1 className="text-light">Manager Panel</h1>
            <div className="row">
                <div className={`col-md-4`}>
                    <div className={`${styles.tile}`}>
                        <h3>Artists</h3>
                        <span>0</span>
                    </div>
                </div>
                <div className={`col-md-4`}>
                    <div className={`${styles.tile}`}>
                        <h3>Songs</h3>
                    </div>
                </div>
                <div className={`col-md-4`}>
                    <div className={`${styles.tile}`}>
                        <h3>Videos</h3>
                    </div>
                </div>
                <div className={`col-md-4`}>
                    <div className={`${styles.tile}`}>
                        <h3>Movies</h3>
                    </div>
                </div>
                <div className={`col-md-4`}>
                    <div className={`${styles.tile}`}>
                        <h3>Albums</h3>
                    </div>
                </div>
                <div className={`col-md-4`}>
                    <div className={`${styles.tile}`}>
                        <h3>Series</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
