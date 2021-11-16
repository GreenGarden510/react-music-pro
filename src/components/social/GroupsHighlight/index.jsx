import React from 'react'
import styles from './index.module.scss';
import { NavLink } from 'react-router-dom';

export const SocialMediaGroupsHighlight = () => {
    return (
        <div className={styles.wrapper}>
            <h3>Your Groups</h3>
            <div className={`d-flex`}>
                <img className={styles.avatar} src={require("$assets/images/test_image.jpg")} alt="" />
                <div className="ml-3">
                    <h5>Good Group</h5>
                    <div className="d-flex align-items-center">
                        <img src={require("$assets/images/icons/bell.svg")} alt="" height="15px" />
                        <span className="mx-2">Notifications</span>
                        <span className={`${styles.badge} p-1`}>12</span>
                    </div>
                    <NavLink to="">View Feed</NavLink>
                </div>
            </div>
            <div className={`${styles.divider} my-3`}></div>
            <div className={`d-flex`}>
                <img className={styles.avatar} src={require("$assets/images/test_image.jpg")} alt="" />
                <div className="ml-3">
                    <h5>Music Group</h5>
                    <div className="d-flex align-items-center">
                        <img src={require("$assets/images/icons/bell.svg")} alt="" height="15px" />
                        <span className="mx-2">Notifications</span>
                        <span className={`${styles.badge} p-1`}>79</span>
                    </div>
                    <NavLink to="">View Feed</NavLink>
                </div>
            </div>
        </div>
    )
}
