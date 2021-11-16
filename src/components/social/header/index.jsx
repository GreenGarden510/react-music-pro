import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { routePaths } from '../../../common/routeConfig';
import { getMediaUrl } from '../../../common/utils';
import { toggleSocialMediaSideMenu } from '../../../redux/features/nav';
import styles from './index.module.scss';

export const SocialMediaHeader = () => {
    //hooks
    const history = useHistory();

    //state
    const [avatar, setAvatar] = useState(null);
    
    //store
    const dispatch = useDispatch()
    const { token, user } = useSelector(state => state.authentication);
    const isOpen = useSelector(state => state.nav.isSocialMediaSideMenuOpen);

    useEffect(async () => {
        if (!user) return;
        const _avatar = await getMediaUrl(user.avatar_url, token);
        setAvatar(_avatar);
    }, [user]);

    const showMenu = () => {
        dispatch(toggleSocialMediaSideMenu(!isOpen));
    }

    return (
        <>
            <div className={`container-fluid ${styles.wrapper}`}>
                <div className="d-flex align-items-center py-3">
                    <div className={`${styles.logo}`}>
                        Mkondo Social
                    </div>
                    <div className="ml-3 d-none d-lg-block">
                        <div className={styles.input}>
                            <img src={require('$assets/images/icons/search.svg')} alt="" height="20px" />
                            <input type="text" className="ml-3" placeholder="Search" />
                        </div>
                    </div>
                    
                    
                    <div className={`ml-auto d-flex align-items-center p-1 ${styles.profile}`}>
                        <img src={avatar} alt="" />
                        <span className={`mx-2 d-none d-lg-block`}>{user.full_name}</span>
                    </div>

                    <div className={`ml-2 d-none d-lg-flex ${styles.iconButton}`}>
                        <img src={require('$assets/images/icons/home_side.svg')} alt="" height="20px" />
                    </div>
                    <div className={`ml-2 d-none d-lg-flex ${styles.iconButton}`}>
                        <img src={require('$assets/images/icons/notification.svg')} alt="" height="20px" />
                    </div>

                    <div className={`ml-2 d-lg-none`}>
                        <img src={require('$assets/images/icons/search.svg')} alt="" height="20px" />
                    </div>
                    <div onClick={showMenu} className={`ml-2 d-lg-none`}>
                        <img src={require('$assets/images/icons/humbeger_menu.svg')} alt="" height="30px" />
                    </div>
                </div>
            </div>
            <div className={`container-fluid d-none d-lg-block ${styles.secondaryWrapper}`}>
                <div className="d-flex align-items-center">
                    <div onClick={showMenu}>
                        <img src={require('$assets/images/icons/humbeger_menu.svg')} alt="" height="30px" />
                    </div>

                    <div className={`d-flex justify-content-center mx-auto ${styles.secondaryMenu}`}>
                        <span className={styles.active}>Newsfeed</span>
                        <span>Videos</span>
                        <span>Groups</span>
                        <span>Blog</span>
                    </div>

                    <div className="ml-auto">
                    <span onClick={() => history.push(routePaths.home)} className={`text-left ${styles.socialButton}`}><span>Switch to <br/></span> Mkondo Media</span>
                    </div>
                </div>
            </div>
        </>
    )
}
