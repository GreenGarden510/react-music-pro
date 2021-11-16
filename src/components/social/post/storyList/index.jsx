import React from 'react'
import styles from './index.module.scss';

export const SocialMediaStoryList = () => {
    return (
        <div className={`${styles.wrapper}`}>
            <h3 className="text-light">Recent Stories</h3>
            <div className={`d-flex ${styles.list}`}>
                <div className={`d-flex flex-column ${styles.itemWrapper}`}>
                    <img className={`${styles.thumb}`} src={require('$assets/images/album-sample.png')} alt=""  />
                    <img className={`${styles.story}`} src={require('$assets/images/test_image.jpg')} alt="" />
                    <div className={`py-2 px-1 ${styles.name}`}>
                        <button className={styles.createButton}><img src={require("$assets/images/icons/add-user.svg")} alt="" /></button>
                        <span>Add your story</span>
                    </div>
                </div>

                <div className={`d-flex flex-column ${styles.itemWrapper}`}>
                    <img className={`${styles.thumb}`} src={require('$assets/images/album-sample.png')} alt=""  />
                    <img className={`${styles.story}`} src={require('$assets/images/test_image.jpg')} alt="" />
                    <div className={`py-2 px-1 ${styles.name}`}>
                        {/* <button className={styles.createButton}><img src={require("$assets/images/icons/add-user.svg")} alt="" /></button> */}
                        <span>Story Name</span>
                    </div>
                </div>

                <div className={`d-flex flex-column ${styles.itemWrapper}`}>
                    <img className={`${styles.thumb}`} src={require('$assets/images/album-sample.png')} alt=""  />
                    <img className={`${styles.story}`} src={require('$assets/images/test_image.jpg')} alt="" />
                    <div className={`py-2 px-1 ${styles.name}`}>
                        {/* <button className={styles.createButton}><img src={require("$assets/images/icons/add-user.svg")} alt="" /></button> */}
                        <span>Story Name</span>
                    </div>
                </div>

                <div className={`d-flex flex-column ${styles.itemWrapper}`}>
                    <img className={`${styles.thumb}`} src={require('$assets/images/album-sample.png')} alt=""  />
                    <img className={`${styles.story}`} src={require('$assets/images/test_image.jpg')} alt="" />
                    <div className={`py-2 px-1 ${styles.name}`}>
                        {/* <button className={styles.createButton}><img src={require("$assets/images/icons/add-user.svg")} alt="" /></button> */}
                        <span>Story Name</span>
                    </div>
                </div>

                <div className={`d-flex flex-column ${styles.itemWrapper}`}>
                    <img className={`${styles.thumb}`} src={require('$assets/images/album-sample.png')} alt=""  />
                    <img className={`${styles.story}`} src={require('$assets/images/test_image.jpg')} alt="" />
                    <div className={`py-2 px-1 ${styles.name}`}>
                        {/* <button className={styles.createButton}><img src={require("$assets/images/icons/add-user.svg")} alt="" /></button> */}
                        <span>Story Name</span>
                    </div>
                </div>

                <div className={`d-flex flex-column ${styles.itemWrapper}`}>
                    <img className={`${styles.thumb}`} src={require('$assets/images/album-sample.png')} alt=""  />
                    <img className={`${styles.story}`} src={require('$assets/images/test_image.jpg')} alt="" />
                    <div className={`py-2 px-1 ${styles.name}`}>
                        {/* <button className={styles.createButton}><img src={require("$assets/images/icons/add-user.svg")} alt="" /></button> */}
                        <span>Story Name</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
