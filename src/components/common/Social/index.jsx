import React, { useState } from 'react';

import Button from '$components/common/Button';
import { socialIcons } from '$common/icons';

import styles from './index.module.scss';

const Social = (props) => {
  // props
  const {
    links,
  } = props;

  // state
  const [active, setActive] = useState('');

  const handleFocus = (value) => {
    setActive(value);
  }

  const handleBlur = (value) => {
    if (value === active) {
      setActive(null);
    }
  }

  const handleClick = (value) => {
    window.open(links[value], '_blank');
  }

  // socials
  return (
    <div className={`row ${styles.socialWrapper}`}>
      {
        Object.values(socialIcons).map((item, idx) => {

          if (!links[item.name]) {
            return null;
          }

          return (
            <div className="col-3" key={`social-wrapper-${idx}`}>
              <Button
                key={`social-btn-${idx}`}
                onClick={() => handleClick(item.name)}
                onMouseEnter={() => handleFocus(item.name)}
                onMouseLeave={() => handleBlur(item.name)}
                isTransparent
                noBorder
              >
                <img
                  src={active === item.name ? item.icon : item.icon}
                  className={styles.socialIcon}
                />
              </Button>
            </div>
          )
        })
      }
    </div>
  )
}

export default Social;
