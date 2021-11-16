import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setLanguage } from '$redux/features/user'

import styles from './index.module.scss';

const LangBar = props => {

    const dispatch = useDispatch();
    const lang = useSelector(store => store.user.language);

    const onLanguageChange = (e) => {
        dispatch(setLanguage(e.target.value));
    }

    return (
        <div>
            <select value={lang} onChange={onLanguageChange} className={styles.wrapper}>
                <option value="en">EN</option>
                <option value="es">ES</option>
            </select>
        </div>
    )

}

export default LangBar;