import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styles from './index.module.scss';

export const SocialMediaSideMenu = () => {
    //state
    const [menuHeight, setMenuHeight] = useState(null);
    const sideMenuRef = useRef()

    //store
    const isOpen = useSelector(state => state.nav.isSocialMediaSideMenuOpen)

    useEffect(() => {
        const { bottom, height: menuHeight } = sideMenuRef.current.getBoundingClientRect()
        const { innerWidth: width, innerHeight: height } = window;
        const x = height - bottom + menuHeight;
        setMenuHeight(x);
        console.log(x);
    }, []);

    return (
        <div ref={sideMenuRef} className={`${styles.wrapper}`} style={{ height: menuHeight, display: isOpen ? 'block' : 'none' }}>
            <div className={`d-flex flex-column mt-5 mx-4 ${styles.menu}`}>
                <div className={`px-4 py-2 ${styles.active}`}>
                    <NavLink to="">Home</NavLink>
                </div>
                <div className={`px-4 py-2`}>
                    <NavLink to="">Groups</NavLink>
                </div>
                <div className={`px-4 py-2`}>
                    <NavLink to="">Chats</NavLink>
                </div>
                <div className={`px-4 py-2`}>
                    <NavLink to="">Some Very Long Menu Bruv</NavLink>
                </div>
            </div>
        </div>
    )
}
